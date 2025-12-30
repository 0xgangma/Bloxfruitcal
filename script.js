const baseValues = {
  Dragon: 400,
  Leopard: 350,
  Dough: 300,
  Spirit: 250,
  Venom: 200,
  Control: 150,
  Shadow: 130,
  Blizzard: 120,
  "Dark Blade": 450,
  "Fruit Storage": 280,
  "2x Money": 220,
  "2x Mastery": 220
};

let values = {...baseValues};

document.addEventListener("DOMContentLoaded", () => {
  loader.style.display = "none";
  document.querySelector(".app").classList.remove("hidden");

  addItem("give");
  addItem("receive");
});

function applyPreset() {
  values = {...baseValues};
  const p = preset.value;

  if (p === "demand") {
    values.Dragon += 50;
    values.Leopard += 40;
    values.Dough += 30;
  }
  if (p === "risky") {
    values.Control -= 20;
    values.Shadow -= 20;
  }

  updateTotals();
}

function addItem(type) {
  const c = document.getElementById(type + "List");
  const r = document.createElement("div");
  r.className = "select-row";

  const s = document.createElement("select");
  s.innerHTML =
    `<option value="0">Select Item</option>` +
    Object.entries(values).map(([k,v]) =>
      `<option value="${v}">${k} (${v})</option>`).join("");

  s.onchange = updateTotals;

  const x = document.createElement("button");
  x.className = "remove";
  x.textContent = "✕";
  x.onclick = () => { r.remove(); updateTotals(); };

  r.append(s,x);
  c.appendChild(r);
}

function sum(id) {
  return [...document.getElementById(id).querySelectorAll("select")]
    .reduce((t,s)=>t + Number(s.value),0);
}

function updateTotals() {
  giveTotal.textContent = sum("giveList");
  receiveTotal.textContent = sum("receiveList");
}

function calculate() {
  const g = +giveTotal.textContent;
  const r = +receiveTotal.textContent;
  if (!g || !r) return;

  const diff = r - g;
  const fair = Math.round((Math.min(g,r)/Math.max(g,r))*100);

  difference.textContent = `Difference: ${diff>0?"+":""}${diff}`;
  fairness.textContent = `Fairness: ${fair}%`;

  let rate =
    diff >= 100 ? "S" :
    diff >= 30 ? "A" :
    diff >= -20 ? "B" :
    diff >= -60 ? "C" : "L";

  rating.textContent = `Rating: ${rate}`;

  result.textContent =
    rate==="S"?"🔥 Huge Win":
    rate==="A"?"✅ Win":
    rate==="B"?"⚖️ Fair":
    rate==="C"?"⚠️ Slight Loss":
    "❌ Bad Trade";

  suggestion.textContent =
    diff < 0 ? `Suggestion: Ask +${Math.abs(diff)} value more`
             : "Suggestion: Trade is acceptable";
}

function shareTrade() {
  const text =
`Bloxfruitcal Trade Result
Give: ${giveTotal.textContent}
Receive: ${receiveTotal.textContent}
${rating.textContent}
${result.textContent}`;

  navigator.clipboard.writeText(text);
  alert("Trade result copied!");
}
