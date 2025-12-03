// SubscriptionModal.jsx - FINAL WITH ONLY THE BLUR FIX APPLIED
import React, { useEffect, useState } from "react";

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
      label: "3 MONTHS",
      priceText: creator?.prices?.threeMonths || "$15 total",
    },
    {
      id: "6months",
      label: "6 MONTHS",
      priceText: creator?.prices?.sixMonths || "$30 total",
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

  const VerifiedBadge = () => (
    <svg
      className="w-4 h-4 ml-1 inline-block align-middle flex-shrink-0"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block" }}
    >
      <image
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAYAAACcuBHKAAAKiUlEQVR4AVxXa3BU5Rl+vnN2N3eg3EQsIKCtov1T7Q8VuTpW5SKCo8UhBCFegBGDQkgisBSCgGjBC7USBBEqjhrLCIKRTplxysWp1nEAmbFqooaIuUgCZJPsnt3t87zJquOZnHzffpf38rzX46VSqXTmicfjmamNyYADt4ME//Hv3A9t6TTHn9bTPz5BEKSTyWQ6kUik9WRGzX9J95drEgK8DD3hcFiDvUGQhOfZFL7v8Oqru3DrH2/F40tKUVtbh46OBNcBndOpxsZGbNmyBZMnT8bzzz+PkB9CZ2entuCcQyqVMj4Uzsaf8/J83ycx3w7rQBAENqe0iMcDXkjjm2/rsef119HU1ISamvdw330zUbqsFK/s3IU333wT69etw+zZs7HxqacoYC1e59kjR48gOzub95MIhUJUyDM+P2fe0dFhvDz9F3ONOqALAVEIh0OIREK86HDwwAF8XVeHrKwsItCBCxcv4ODBA8Z0VTSKqm3bUMf9vPx83ongzJkzJkhHrMOYi7aUyiCe+Z2Tk6MpvICah2mGzCHB5vXYoaOzC6c+O42dO18FMTWCk+64A8OGDUNBQT46uzrheFb3r7rqKkyYMAG5ubn2fvjhh2hsauQ1h66uLpotoEI+jh09itOnT0NPRnny8/Ub6TTskMZYLIajR45hywsvYP7D89F2vs1g/cP11+OZZ/6CV3bswI7t27Fh/XqsWL4cW7duxaZNm/Dcc89h/vz5iLW3mylkahEnE0jQlStXYmlpKR5dtAgnTpywtZ59ZwJ4nsN7B2vw0EMPYeyYcSgqKsK2l19Gyw8tuHDhAq4YORLr1q03zS65ZCCuvfZ3uPvuGZg5cybGjBmD4cOHmxJTJk/BmspK7KCggwYNMvNJgIqKCuzduxf19fVggCGVTEJIyAIeiEA6BS4C1dVv4/C/DqOpuYmQ5hmEDC+MvukmOuIyDB48iE7mEd6EjbwKz/eMmLSWafv174fCWYUYSaFDdEjZvaysDAfoV21tbejTpw+mTJmCUaNG/YQEeh45TRdtLMKRSATXXDMKRfT4DRs24G8vvUR0bgajzN6srLDdElOZL0yfkrBiahsORDdtJoxGo9i3bx8uXrxIPyrAnDlzsHjxYvgU0M7ynxcEKXiMkXDYR79+/cy783Lz8DB94YnlyzH9rmnoRSeUAEEyAU8uJCa8HGYEOc5lLgkuaOVP3DKzPf3009izZ4/RLCgoMH9ZRH9wzpnpZA7nHLxQiBZJw57hI0agnRKfaz2HlpZmBIkEpKk2xTwS6UYgkQjIRNpqB6ahBHDO0Yy5tlheXm5hGiZKErKwsBDFxcXwPI9opkg3beYQa4+Z1ghqlFf36t3b8oFsKabJJB2G2oqx4BeHUEhwSIgUE1pcS/ZKM01kwv3795tT+r5v8JeUlBhT7TvnyNNpaq/nMyVr9m39tzh8+DCUaiXtb377Wy2bA2qiNdlcGmeYaU1m0L5zjmdDWM+wfYk+JDoS4P7778eCBQsMAecclN7lf6IhWrrrCe729i6srXwSn3/+OeQPN95wA4YMGaJ9OpcAAz755BPMmjULK1asoJkC28sgowSn+dq1a380gVL2I488Ar3OOYugtxl9U6dOxb333INEPN5tFoYnzQEsWbIER5nJsrNz0bdvXxapJQj5vgngE6lOZs7/fvwxTp06hd27dnH/cbSeazXnUlQIkY0bN2L37t2GpASYN28e5s6da+hIYp354ov/8d45nDh5kvXnPjQ3N9OmgPf313ZTgCNmW8Hz2GOP4VqGJ4UnhM4Eyc7OwsgrriACCRT06sWkdhALFi4wJ5Y5lAlVtISIBBDzhQsXWlRIgIC1SKaZeMstzKQ5tn7y1GfMvs/QNyiEIkCOlkaKySmB3n166x4SiaQd8EPOfk+YMB5/Xr0a2SxiIXr8Rx/9B+UVZdi4cQP+sfdtnk9YZMwpKmJafpQKMO55M8FIEv1UKs2IAPLzC5js4oaQwlmKe3Kc6677vUnn0+tXRaP46qtaerIPOJB4YLYDn+nTpyO6ahUG9O/PX2AlPQil57bWNshpFYIlJYuhe4IffMLhEBFMoamxGc9ufhZnv/+eqw4DB1yCsrJyHe0WeNOmzRg/bhwZJpgffsALLFyCkKcpTMgOOefM3rfddpvVhv79+iOd7jbX0KHDULq0FMXzipFSDeDFzp6GhlOju21bFU7Sp5xzGH755Xhtz2v49WWXwTkHwywvL4devxKjrr4a7bF2+sgxNLKBSSXT9IkUUkyXCivZWxqrZK9es8YQkU9MZS1Q5GTnZJvA4KM8k1FEfYhqR0tLC7NvL0SjUVw2eDCSpMuj3ULEYp0YNGggbqHjeJRMTct5lm+PkeH7nhH2fd+cV5cUEeOI3NonnzSCpaXLAJpO9g3Yn4CP5iGaN0VfaPjuDNpZ3nszEY4cOQI33nQjT4DRZRioqUnRobKRZjpIUTLP9xEjGg3sjnRSxISC5tJao8fUK0QmTpwI+Umasa67Oqd1Cemc01Eq4EgvRoaiG2N0ZEteBkHS9vXPaod6Sd1pbW0l9El6cB4GsmcQUeecEUDPo0wXZnSIqeYSyDlHj+8y55TQGWF1RsjE411EsYs1Jh9ff/0NEgxZFUwpDork8UUkK4ROtmC1tbX0gaQRVPZT99zcxELWA7GEkgABiYi55inCrfoiHwCfLtLhgPPnz1v39OKLL7IZWodYR4zl/AIFiBsP8U0ReZ1ly5/WCEmfl5dLbXxCFeDTTz+1dm0aS/lq5ofvGr6Dc90QO9c9ShPnHJHySDgFPeFwBF9++SXKli3DjBkzjMbx48ftbhZzTDIZmIl0NsnuSiMVchZCnudw75/uxQ2sG+orBCs3cfbsWTa6OyFkEvEEaH74nmedmERRRCbiSVvTXkNDA+YUzcH7hw6RmUelQhBKvZhp1e6p
        x="0"
        y="0"
        width="33"
        height="32"
      />
    </svg>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      onClick={onClose}
    >
      {/* Dark overlay (keeps same visual) */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Separate blur layer (pointer-events-none to keep clicks working) */}
      <div className="absolute inset-0 backdrop-blur-sm pointer-events-none" />

      {/* Removed blur from this main wrapper — rest of component unchanged */}
      <div
        className="w-full mx-4 my-8 sm:mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-2xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="px-6 mt-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              {creator?.name || "Creator Name"}
              <VerifiedBadge />
            </h3>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {creator?.handle || "@username"}
          </p>
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
    </div>
  );
}
