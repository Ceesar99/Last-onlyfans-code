// SubscriptionModal.jsx
import React, { useEffect, useState } from "react";

export default function SubscriptionModal({
  creator,
  selectedPlan,
  onSelectPlan,
  onClose,
  freeSampleActive = false,
}) {
  const plans = [
    {
      id: "monthly",
      label: "Monthly",
      priceText: freeSampleActive
        ? creator?.prices?.monthly || "$5 / month"
        : "FREE for 30 days",
    },
    {
      id: "3months",
      label: "3 MONTHS",
      priceText: creator?.prices?.threeMonths || "$15 total",
    },
    {
      id: "6months",
      label: "6 MONTHS",
      priceText: creator?.prices?.sixMonths || "$30 total",
    },
  ];

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [iframeToken, setIframeToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (typeof document !== "undefined" && document?.body) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "auto";
      };
    }
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan || !isValidEmail(email)) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/charge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": process.env.APP_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            billing_email: email,
            plan: selectedPlan,
          }),
        }
      );

      if (!response.ok) {
        throw new Error((await response.text()) || "Payment initiation failed");
      }

      const { iframe_token, session_id } = await response.json();
      setIframeToken(iframe_token);
      setSessionId(session_id);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl overflow-hidden w-[90%] max-w-[640px] mx-auto shadow-xl">
        {/* Banner */}
        <div className="h-28 overflow-hidden">
          <img
            src={creator?.banner || "https://via.placeholder.com/720x220"}
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile picture */}
        <div className="px-6 -mt-12 relative">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shadow">
            <img
              src={creator?.avatar || "https://via.placeholder.com/80"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name & verified badge */}
        <div className="px-6 mt-2 ml-24">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              {creator?.name || "Creator Name"}
            </h3>

            {/* Verified badge: kept your base64 image, adjusted attributes for JSX */}
            <span className="inline-flex items-center" aria-hidden>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 33 32"
                role="img"
                aria-label="Verified"
              >
                {/* NOTE: switched to 'href' (JSX compatible) and kept your base64 */}
                <image
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAYAAACcuBHKAAAKiUlEQVR4AVxXa3BU5Rl+vnN2N3eg3EQsIKCtov1T7Q8VuTpW5SKCo8UhBCFegBGDQkgisBSCgGjBC7USBBEqjhrLCIKRTplxysWp1nEAmbFqooaIuUgCZJPsnt3t87zJquOZnHzffpf38rzX46VSqXTmi..."
                  x="0"
                  y="0"
                  width="18"
                  height="18"
                />
              </svg>
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {creator?.handle || "@username"}
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 pb-4 mt-4">
          <div className="text-sm uppercase text-gray-400 font-semibold">
            SUBSCRIBE AND GET THESE BENEFITS:
          </div>
          <ul className="mt-4 space-y-3">
            {[
              "Full access to this user's content",
              "Direct message with this user",
              "Cancel your subscription at any time",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 mt-1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    stroke="#00AFF0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-sm text-gray-800">{text}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Plans */}
        <div className="px-6 pb-6">
          <div
            className="mt-2 space-y-3"
            role="radiogroup"
            aria-label="Subscription plans"
          >
            {plans.map((p) => {
              const active = selectedPlan === p.id;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => onSelectPlan && onSelectPlan(p.id)}
                  className={`w-full py-3 px-4 rounded-full border flex justify-between items-center transition ${
                    active
                      ? "border-[#00AFF0] text-[#00AFF0] font-semibold"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  <span>{p.label}</span>
                  <span
                    className={
                      p.id === "monthly"
                        ? "text-sm text-gray-500 whitespace-nowrap"
                        : "text-sm font-semibold"
                    }
                  >
                    {p.priceText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Email Input */}
          <div className="mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your billing email"
              className="w-full py-3 px-4 rounded-full border border-gray-200 text-gray-700 focus:border-[#00AFF0] focus:outline-none transition"
              aria-label="Billing email"
            />
          </div>

          {/* Payment button */}
          <div className="mt-6">
            <button
              onClick={handlePayment}
              disabled={!selectedPlan || !isValidEmail(email) || isLoading}
              className={`w-full py-3 rounded-full border transition ${
                !selectedPlan || !isValidEmail(email) || isLoading
                  ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "border-[#00AFF0] text-[#00AFF0] font-semibold hover:bg-[#00AFF0] hover:text-white"
              }`}
            >
              {isLoading ? "Processing..." : "PLEASE ADD A PAYMENT CARD"}
            </button>
          </div>

          {/* Payment iframe */}
          {iframeToken && (
            <div className="mt-4 text-center">
              <iframe
                src={`https://api.maxelpay.com/embed?token=${iframeToken}`}
                width="100%"
                height="80"
                style={{ border: "none" }}
                title="Maxel Payment Iframe"
              ></iframe>
              <p className="text-sm text-gray-500 mt-2">
                Enter your card details above to complete subscription.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
          )}

          {/* Close button */}
          <div className="mt-4 text-right">
            <button
              onClick={onClose}
              className="text-sm font-semibold text-[#00AFF0]"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
