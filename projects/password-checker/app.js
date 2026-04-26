function calculateStrength(password) {
    let score = 0;
    if (!password) return 0;
    
    // Add 1 point for each criteria met
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++; // Has uppercase
    if (/[0-9]/.test(password)) score++; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score++; // Has special char
    
    return score; // Returns a value between 0 and 4
}


let chart;

function updateGraph(score){
  const ctx = document.getElementById("chart");

  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"line",
    data:{
      labels:["0","1","2","3","4"],
      datasets:[{
        data:[0,1,2,3,4].map(i=> i<=score?i:null),
        tension:0.4
      }]
    },
    options:{
      plugins:{legend:false},
      scales:{x:{display:false},y:{display:false}}
    }
  });
}
// js/projects/password-checker/app.js
import { checkBreach } from '../../modules/password.js';

const passwordInput = document.getElementById('password-input');

passwordInput.addEventListener('input', async () => {
    const password = passwordInput.value;
    
    // 1. Calculate a score (e.g., 0-4) based on length and complexity
    let score = calculateStrength(password); 
    
    // 2. Update the visual graph using the code you just shared
    updateGraph(score);
    
    // 3. Check for security breaches (from our previous step)
    const breachStatus = await checkBreach(password);
    document.getElementById('breach-label').innerText = breachStatus;
});


// js/projects/password-checker/app.js

// ... (Your existing Chart.js and checkBreach code) ...

function saveHistory(p) {
  let h = JSON.parse(localStorage.getItem("history") || "[]");

  if (!h.includes(p)) {
    h.unshift(p);
    if (h.length > 5) h.pop();
    localStorage.setItem("history", JSON.stringify(h));
  }

  renderHistory();
}

function renderHistory() {
  const el = document.getElementById("history");
  if (!el) return; // Safety check

  let h = JSON.parse(localStorage.getItem("history") || "[]");
  el.innerHTML = h.map(p => `<div>${p}</div>`).join("");
}

// Update your listener to use the new logic
passwordInput.addEventListener('input', async () => {
    const password = passwordInput.value;
    let score = calculateStrength(password); 
    
    updateGraph(score);

    // Save to history only if the password is strong (score 3 or 4)
    if (score >= 3) {
        saveHistory(password);
    }

    const breachStatus = await checkBreach(password);
    document.getElementById('breach-label').innerText = breachStatus;
});

// Load history when the page opens
renderHistory();