// SubscriptionModal.jsx
import React, { useEffect } from "react";

export default function SubscriptionModal({
  creator,
  selectedPlan,
  onSelectPlan,
  onAddCard,
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
      label: "3 MONTHS (30% off)",
      priceText: creator?.prices?.threeMonths || "$8.58 total",
    },
    {
      id: "6months",
      label: "6 MONTHS (40% off)",
      priceText: creator?.prices?.sixMonths || "$11.59 total",
    },
  ];

  // Disable page scroll when modal is open
  useEffect(() => {
    if (typeof document !== "undefined" && document?.body) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        try {
          document.body.style.overflow = prevOverflow || "auto";
        } catch (e) {
          /* ignore */
        }
      };
    }
    return undefined;
  }, []);

  const handleAddCard = () => {
    if (!selectedPlan) return;

    try {
      if (typeof onAddCard === "function") {
        onAddCard();
      }
    } catch (e) {
      try {
        onAddCard(selectedPlan);
      } catch (e2) {
        console.warn("SubscriptionModal: onAddCard call failed:", e2);
      }
    }
  };

  return (
    <div className="modal-card bg-white rounded-2xl overflow-hidden max-w-[640px] mx-auto shadow-xl">
      <div className="h-28 overflow-hidden">
        <img
          src={creator?.banner || "https://via.placeholder.com/720x220"}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-6 -mt-12 relative">
        <div className="relative w-20 h-20 rounded-full overflow-hidden shadow">
          <img
            src={creator?.avatar || "https://via.placeholder.com/80"}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="px-6 mt-2 ml-24">
        <h3 className="text-lg font-semibold text-gray-900">
          {creator?.name || "Creator Name"}
        </h3>
        <p className="text-sm text-gray-500">{creator?.handle || "@username"}</p>
      </div>

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
                aria-label={`Select ${p.label} plan, ${p.priceText}`}
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

        <div className="mt-6">
          <button
            onClick={handleAddCard}
            disabled={!selectedPlan}
            className={`w-full py-3 rounded-full border transition ${
              !selectedPlan
                ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                : "border-[#00AFF0] text-[#00AFF0] font-semibold hover:bg-[#00AFF0] hover:text-white"
            }`}
            aria-disabled={!selectedPlan}
          >
            PLEASE ADD A PAYMENT CARD
          </button>
        </div>

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
  );
}
