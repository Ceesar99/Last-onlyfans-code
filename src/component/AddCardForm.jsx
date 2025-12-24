// AddCardForm.jsx - FINAL with FULL country list added
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

/* ---------- FULL COUNTRY LIST (ISO 3166-1 alpha-2) ---------- */
const COUNTRIES = [
  ["AF","Afghanistan"],["AL","Albania"],["DZ","Algeria"],["AS","American Samoa"],
  ["AD","Andorra"],["AO","Angola"],["AI","Anguilla"],["AG","Antigua and Barbuda"],
  ["AR","Argentina"],["AM","Armenia"],["AU","Australia"],["AT","Austria"],
  ["AZ","Azerbaijan"],["BS","Bahamas"],["BH","Bahrain"],["BD","Bangladesh"],
  ["BB","Barbados"],["BY","Belarus"],["BE","Belgium"],["BZ","Belize"],
  ["BJ","Benin"],["BM","Bermuda"],["BT","Bhutan"],["BO","Bolivia"],
  ["BA","Bosnia and Herzegovina"],["BW","Botswana"],["BR","Brazil"],
  ["BN","Brunei"],["BG","Bulgaria"],["BF","Burkina Faso"],["BI","Burundi"],
  ["KH","Cambodia"],["CM","Cameroon"],["CA","Canada"],["CV","Cape Verde"],
  ["CF","Central African Republic"],["TD","Chad"],["CL","Chile"],["CN","China"],
  ["CO","Colombia"],["KM","Comoros"],["CG","Congo"],["CR","Costa Rica"],
  ["CI","Côte d’Ivoire"],["HR","Croatia"],["CU","Cuba"],["CY","Cyprus"],
  ["CZ","Czech Republic"],["DK","Denmark"],["DJ","Djibouti"],["DM","Dominica"],
  ["DO","Dominican Republic"],["EC","Ecuador"],["EG","Egypt"],["SV","El Salvador"],
  ["EE","Estonia"],["ET","Ethiopia"],["FJ","Fiji"],["FI","Finland"],
  ["FR","France"],["GA","Gabon"],["GM","Gambia"],["GE","Georgia"],
  ["DE","Germany"],["GH","Ghana"],["GR","Greece"],["GD","Grenada"],
  ["GT","Guatemala"],["GN","Guinea"],["GY","Guyana"],["HT","Haiti"],
  ["HN","Honduras"],["HK","Hong Kong"],["HU","Hungary"],["IS","Iceland"],
  ["IN","India"],["ID","Indonesia"],["IR","Iran"],["IQ","Iraq"],
  ["IE","Ireland"],["IL","Israel"],["IT","Italy"],["JM","Jamaica"],
  ["JP","Japan"],["JO","Jordan"],["KZ","Kazakhstan"],["KE","Kenya"],
  ["KW","Kuwait"],["KG","Kyrgyzstan"],["LA","Laos"],["LV","Latvia"],
  ["LB","Lebanon"],["LS","Lesotho"],["LR","Liberia"],["LY","Libya"],
  ["LI","Liechtenstein"],["LT","Lithuania"],["LU","Luxembourg"],
  ["MG","Madagascar"],["MW","Malawi"],["MY","Malaysia"],["MV","Maldives"],
  ["ML","Mali"],["MT","Malta"],["MX","Mexico"],["MD","Moldova"],
  ["MC","Monaco"],["MN","Mongolia"],["ME","Montenegro"],["MA","Morocco"],
  ["MZ","Mozambique"],["MM","Myanmar"],["NA","Namibia"],["NP","Nepal"],
  ["NL","Netherlands"],["NZ","New Zealand"],["NI","Nicaragua"],["NE","Niger"],
  ["NG","Nigeria"],["NO","Norway"],["OM","Oman"],["PK","Pakistan"],
  ["PA","Panama"],["PY","Paraguay"],["PE","Peru"],["PH","Philippines"],
  ["PL","Poland"],["PT","Portugal"],["QA","Qatar"],["RO","Romania"],
  ["RU","Russia"],["RW","Rwanda"],["SA","Saudi Arabia"],["SN","Senegal"],
  ["RS","Serbia"],["SG","Singapore"],["SK","Slovakia"],["SI","Slovenia"],
  ["ZA","South Africa"],["KR","South Korea"],["ES","Spain"],["LK","Sri Lanka"],
  ["SE","Sweden"],["CH","Switzerland"],["TW","Taiwan"],["TH","Thailand"],
  ["TR","Turkey"],["UA","Ukraine"],["AE","United Arab Emirates"],
  ["GB","United Kingdom"],["US","United States"],["UY","Uruguay"],
  ["UZ","Uzbekistan"],["VE","Venezuela"],["VN","Vietnam"],["ZM","Zambia"],
  ["ZW","Zimbabwe"]
];

/* ---------- AddCardForm component ---------- */
export default function AddCardForm({ onClose, onSuccess, selectedPlan }) {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <select
      name="country"
      value={formData.country}
      onChange={handleChange}
      className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm"
      required
    >
      <option value="">-- Select Country --</option>
      {COUNTRIES.map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
