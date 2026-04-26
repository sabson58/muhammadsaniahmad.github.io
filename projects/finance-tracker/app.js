// 1. IMPORTS
// DELETE these two lines:


// 2. CONFIGURATION & DATA
const icons = {
  Food: "🍔",
  Transport: "🚗",
  Salary: "💰",
  Shopping: "🛍️"
};

let transactions = [
    { date: "2026-04-01", desc: "Salary", amount: 200000, type: "income", category: "Salary" },
    { date: "2026-04-05", desc: "Grocery Store", amount: 15000, type: "expense", category: "Food" },
    { date: "2026-04-10", desc: "Fuel", amount: 5000, type: "expense", category: "Transport" }
];

// 3. UI RENDERING FUNCTIONS
let myChart = null; 

function renderCalendar(data) {
  const calendar = document.getElementById("calendar");
  if (!calendar) return;

  calendar.innerHTML = data.map(tx => `
    <div class="day">
      <strong>${tx.date}</strong>
      <span>${icons[tx.category] || "📦"}</span> 
      <p>${tx.desc} - ₦${tx.amount}</p>
    </div>
  `).join("");
}

function renderAnalytics(data) {
  const monthlyTotals = groupByMonth(data);
  const labels = Object.keys(monthlyTotals);
  const dataValues = Object.values(monthlyTotals);
  const ctx = document.getElementById('financeChart').getContext('2d');

  if (myChart) myChart.destroy(); // Fixes "Canvas in use" error

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Net Monthly Balance (₦)',
        data: dataValues,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: { responsive: true }
  });
}

// 4. DATABASE ACTIONS
async function addTx() {
  const descEl = document.getElementById("desc");
  const amtEl = document.getElementById("amt");
  const typeEl = document.getElementById("type");
  const dateEl = document.getElementById("date");

  const newTx = {
    desc: descEl.value,
    amt: Number(amtEl.value),
    type: typeEl.value,
    date: dateEl.value,
    category: descEl.value // Maps description to icon
  };

  if (!newTx.desc || !newTx.amt) return alert("Please fill in all fields");

  try {
    await db.collection("transactions").add(newTx); // Save to Firebase
    console.log("Transaction saved to Firebase!");
    
    transactions.push(newTx);
    renderCalendar(transactions);
    renderAnalytics(transactions);

    descEl.value = "";
    amtEl.value = "";
  } catch (error) {
    console.error("Error saving to Firebase: ", error);
  }
}

// 5. EXPOSE TO GLOBAL SCOPE
window.addTx = addTx;

// 6. INITIALIZE
renderCalendar(transactions);
renderAnalytics(transactions);