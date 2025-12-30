let baseValues = {
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

function applyPreset() {
  let p = document.getElementById("preset").value;
  values = {...baseValues};

  if (p === "demand") {
    values.Dragon += 50;
    values.Leopard += 40;
    values.Dough += 30;
  }

  if (p === "risky") {
    values.Control -= 20;
    values.Shadow -= 20;
  }

  document.querySelectorAll("select").forEach(s => {
    if (values[s.options[s.selectedIndex]?.text.split(" (")[0]])
      s.value = values[s.options[s.selectedIndex].text.split(" (")[0]];
  });
}

function addItem(type) {
  const c = document.getElementById(type + "List");
  const r = document.createElement("div");
  r.className = "select-row";

  const s = document.createElement("select");
  s.innerHTML = `<option value="0">Select</option>` +
    Object.entries(values).map(([k,v]) =>
      `<option value="${v}">${k} (${v})</option>`).join("");

  s.onchange = updateTotals;

  const x = document.createElement("button");
  x.innerText = "✕";
  x.className = "remove";
  x.onclick = () => { r.remove(); updateTotals(); };

  r.append(s,x);
  c.appendChild(r);
}

function sum(id) {
  return [...document.getElementById(id).querySelectorAll("select")]
    .reduce((t,s)=>t+Number(s.value),0);
}

function updateTotals() {
  giveTotal.innerText = sum("giveList");
  receiveTotal.innerText = sum("receiveList");
}

function calculate() {
  let g = +giveTotal.innerText;
  let r = +receiveTotal.innerText;
  if(!g||!r) return;

  let diff = r - g;
  let fairness = Math.min(100, Math.round((Math.min(g,r)/Math.max(g,r))*100));

  difference.innerText = `Difference: ${diff>0?"+":""}${diff}`;
  fairness.innerText = `Fairness: ${fairness}%`;

  let rate = diff >= 100 ? "S"
           : diff >= 30  ? "A"
           : diff >= -20 ? "B"
           : diff >= -60 ? "C"
           : "L";

  rating.innerText = `Rating: ${rate}`;

  result.innerText =
    rate === "S" ? "🔥 HUGE WIN" :
    rate === "A" ? "✅ WIN" :
    rate === "B" ? "⚖️ FAIR" :
    rate === "C" ? "⚠️ SLIGHT LOSS" :
    "❌ BAD TRADE";

  suggestion.innerText =
    diff < 0 ? `Suggestion: Ask +${Math.abs(diff)} value more` :
    "Suggestion: Trade is acceptable";
}

function shareTrade() {
  const text =
`Bloxfruitcal Trade Result
Give: ${giveTotal.innerText}
Receive: ${receiveTotal.innerText}
${result.innerText}
Rating: ${rating.innerText}`;

  navigator.clipboard.writeText(text);
  alert("Trade copied!");
}
