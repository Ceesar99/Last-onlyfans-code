// SubscriptionModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

/**
 * Environment requirements:
 * - process.env.NEXT_PUBLIC_SUPABASE_URL
 * - process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - process.env.NEXT_PUBLIC_CHARGE_ENDPOINT (optional; defaults to `${SUPABASE_URL}/functions/v1/charge`)
 * - process.env.NEXT_PUBLIC_FRONTEND_ORIGIN should match your FRONTEND_ORIGIN env on backend
 * - process.env.APP_INTERNAL_SECRET must be set in runtime (use server-side calls or proxy)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const CHARGE_ENDPOINT = process.env.NEXT_PUBLIC_CHARGE_ENDPOINT || `${SUPABASE_URL}/functions/v1/charge`;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function SubscriptionModal({
  creator,
  selectedPlan,
  onSelectPlan,
  onClose,
  freeSampleActive = false,
  onUnlocked = () => {}, // callback when unlocked
}) {
  const plans = [
    {
      id: "monthly",
      label: "Monthly",
      priceText: freeSampleActive ? creator?.prices?.monthly || "$5 / month" : "FREE for 30 days",
    },
    { id: "3months", label: "3 MONTHS", priceText: creator?.prices?.threeMonths || "$15 total" },
    { id: "6months", label: "6 MONTHS", priceText: creator?.prices?.sixMonths || "$30 total" },
  ];

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const supabaseSubRef = useRef(null);
  const pollTimerRef = useRef(null);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  useEffect(() => {
    // lock body scroll while modal open
    const prev = typeof document !== "undefined" ? document.body.style.overflow : null;
    if (typeof document !== "undefined") document.body.style.overflow = "hidden";
    return () => { if (typeof document !== "undefined") document.body.style.overflow = prev || "auto"; };
  }, []);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      teardownRealtime();
      clearPollTimer();
    };
  }, []);

  const setupRealtime = (sid) => {
    teardownRealtime();
    if (!sid) return;
    // subscribe to payments row for this session_id
    // using default realtime channel: table with filter session_id=eq.sid
    supabaseSubRef.current = supabase
      .channel(`payments_session_${sid}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "payments", filter: `session_id=eq.${sid}` },
        (payload) => {
          const newRow = payload?.new;
          if (newRow?.status === "collected" || newRow?.status === "settled") {
            // unlock immediately on collected
            handleUnlock(newRow);
          }
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // optionally fetch current row in case update happened before subscription
          try {
            const { data } = await supabase.from("payments").select("*").eq("session_id", sid).maybeSingle();
            if (data && (data.status === "collected" || data.status === "settled")) handleUnlock(data);
          } catch (e) { /* ignore */ }
        }
      });
  };

  const teardownRealtime = async () => {
    try {
      if (supabaseSubRef.current) {
        await supabase.removeChannel(supabaseSubRef.current);
        supabaseSubRef.current = null;
      }
    } catch (e) { /* ignore errors on cleanup */ }
  };

  const startPollFallback = (sid) => {
    clearPollTimer();
    if (!sid) return;
    pollTimerRef.current = setInterval(async () => {
      try {
        const { data } = await supabase.from("payments").select("*").eq("session_id", sid).maybeSingle();
        if (data && (data.status === "collected" || data.status === "settled")) {
          handleUnlock(data);
          clearPollTimer();
        }
      } catch (e) { /* ignore polling errors */ }
    }, 3000);
  };

  const clearPollTimer = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const handleUnlock = (row) => {
    if (unlocked) return;
    setUnlocked(true);
    onUnlocked(row);
    // good UX: close modal after small delay, or keep open to show confirmation
    // onClose(); // optional: close modal immediately
  };

  const handlePayment = async () => {
    setError(null);
    if (!selectedPlan || !isValidEmail(email)) {
      setError("Select a plan and enter a valid email");
      return;
    }
    setIsLoading(true);

    try {
      // call backend charge function; this call should be server-to-server authorized (internal secret)
      const res = await fetch(CHARGE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Note: Do NOT expose APP_INTERNAL_SECRET in client-side JS in production.
          // This call should be proxied through your server or use a short-lived token.
        },
        body: JSON.stringify({ billing_email: email, plan: selectedPlan }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Payment initiation failed");
      }

      // backend returns: { session_id, invoice_url }
      const body = await res.json();
      const sid = body.session_id || body.sessionId || body.id;
      const url = body.invoice_url || body.invoiceUrl || body.invoice;

      if (!sid || !url) throw new Error("Bad response from payment provider");

      setSessionId(sid);
      setInvoiceUrl(url);

      // Setup realtime subscription & polling fallback
      setupRealtime(sid);
      startPollFallback(sid);

      // KEEP UI unlocked only when payments.status becomes 'collected' via realtime or polling.
      // The iframe can also postMessage; we add a listener below as additional quick signal.
    } catch (err) {
      console.error("[SubscriptionModal] payment init error", err);
      setError(err?.message || "Payment initiation failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for postMessage from iframe as a supplementary quick signal (not trusted alone)
  useEffect(() => {
    const onMessage = (event) => {
      try {
        // basic origin check: allow nowpayments domains or your frontend origin if using proxy
        if (!event.origin) return;
        if (!event.origin.includes("nowpayments") && !event.origin.includes("nowpayment")) return;
        const data = event.data;
        if (!data) return;
        // Many providers post structured messages; handle a simple 'status: success' message
        if (data?.status === "success" && sessionId) {
          // even if iframe signals success, validate by checking payments table
          // quick check:
          supabase.from("payments").select("*").eq("session_id", sessionId).maybeSingle().then(({ data }) => {
            if (data && (data.status === "collected" || data.status === "settled")) {
              handleUnlock(data);
              clearPollTimer();
            }
          }).catch(() => { /* ignore */ });
        }
      } catch (e) {
        /* ignore message parsing errors */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [sessionId, unlocked]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl overflow-hidden w-[90%] max-w-[720px] mx-auto shadow-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{creator?.name || "Creator"}</h3>
              <p className="text-sm text-gray-500">{creator?.handle || "@username"}</p>
            </div>
            <button onClick={onClose} className="text-sm font-semibold text-blue-600">Close</button>
          </div>

          <div className="mt-4 space-y-3">
            {plans.map((p) => {
              const active = selectedPlan === p.id;
              return (
                <button key={p.id} onClick={() => onSelectPlan && onSelectPlan(p.id)}
                  className={`w-full py-3 px-4 rounded-full border flex justify-between items-center ${active ? "border-blue-500 text-blue-600" : "border-gray-200"}`}>
                  <span>{p.label}</span>
                  <span className="text-sm">{p.priceText}</span>
                </button>
              );
            })}
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Billing email"
            className="w-full mt-4 py-3 px-4 rounded-full border focus:border-blue-500"
            aria-label="Billing email"
          />

          <button
            onClick={handlePayment}
            disabled={!selectedPlan || !isValidEmail(email) || isLoading}
            className={`w-full mt-4 py-3 rounded-full ${(!selectedPlan || !isValidEmail(email) || isLoading) ? "bg-gray-100 text-gray-400" : "bg-blue-600 text-white"}`}
          >
            {isLoading ? "Processing..." : "ADD PAYMENT CARD"}
          </button>

          {error && <p className="text-sm text-red-600 mt-3 text-center">{error}</p>}

          {/* Embedded iframe (no redirect). Use invoice_url returned from backend */}
          {invoiceUrl && (
            <div className="mt-4">
              <div className="w-full border rounded-lg overflow-hidden">
                <iframe
                  src={invoiceUrl}
                  title="Payment checkout"
                  width="100%"
                  height="620"
                  style={{ border: "none" }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Payment is handled securely by NOWPayments. Do not close this window while processing.
              </p>
            </div>
          )}

          {unlocked && (
            <div className="mt-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-center">
              Payment confirmed — subscription unlocked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
