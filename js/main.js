
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});



const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
  } else {
    nav.style.boxShadow = "none";
  }
});

const toggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggle.checked = true;
}

// Toggle theme
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});





const elements = {
  input: document.getElementById('ipInput'),
  btn: document.getElementById('lookupBtn'),
  err: document.getElementById('errMsg'),
  resultSection: document.getElementById('resultSection'),
  historySection: document.getElementById('historySection'),
  historyList: document.getElementById('historyList'),
  myIp: document.getElementById('myIp'),
};

let history = JSON.parse(localStorage.getItem('ip_history')) || [];
let myIpVal = '';

// Fetch user's IP
async function fetchIpData(ip) {
  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await res.json();

  if (data.error) {
    throw new Error(data.reason);
  }

  return data;
}

// UI helpers
function setLoading(isLoading) {
  elements.btn.disabled = isLoading;
  elements.btn.innerHTML = isLoading
    ? '<span class="spinner"></span>Looking up...'
    : 'Look up';
}

function showError(msg) {
  elements.err.textContent = msg;
  elements.err.classList.remove('hidden');
}

function hideError() {
  elements.err.classList.add('hidden');
}

// API call
async function fetchIpData(ip) {
  const res = await fetch(`https://freeipapi.com/api/json/${ip}`);
  const data = await res.json();
  if (data.message) throw new Error(data.message);
  return data;
}

// Render result
function renderResult(d, ip) {
  document.getElementById('resIp').textContent = ip;
  document.getElementById('resLoc').textContent = `${d.city || '—'}, ${d.country_name || '—'}`;
  document.getElementById('resCountry').textContent = d.country_name || '—';
  document.getElementById('resRegion').textContent = d.region || '—';
  document.getElementById('resCity').textContent = d.city || '—';
  document.getElementById('resTimezone').textContent = d.timezone || '—';
  document.getElementById('resIsp').textContent = d.org || '—';
  document.getElementById('resAsn').textContent = d.asn || '—';
  document.getElementById('resCoords').textContent =
    d.latitude && d.longitude
      ? `${d.latitude}, ${d.longitude}`
      : 'Coordinates unavailable';

  elements.resultSection.classList.remove('hidden');
}

// History
function updateHistory(entry) {
  history = history.filter(h => h.ip !== entry.ip);
  history.unshift(entry);
  history = history.slice(0, 5);
  localStorage.setItem('ip_history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (!history.length) {
    elements.historySection.classList.add('hidden');
    return;
  }

  elements.historySection.classList.remove('hidden');

  elements.historyList.innerHTML = history.map(h => `
    <div class="history-item" data-ip="${h.ip}">
      <div class="h-ip">${h.ip}</div>
      <div class="h-loc">${h.loc}</div>
    </div>
  `).join('');
}

// Main lookup
async function lookup() {
  const ip = elements.input.value.trim();
  if (!ip) return;

  hideError();
  setLoading(true);

  try {
    const data = await fetchIpData(ip);
    renderResult(data, ip);

    updateHistory({
      ip: data.ipAddress || ip,
      loc: `${data.cityName || '—'}, ${data.countryName || '—'}`
    });

  } catch {
    showError('Could not look up that IP.');
  }

  setLoading(false);
}

// Events
elements.btn.addEventListener('click', lookup);

elements.input.addEventListener('keydown', e => {
  if (e.key === 'Enter') lookup();
});

elements.historyList.addEventListener('click', (e) => {
  const item = e.target.closest('.history-item');
  if (!item) return;
  elements.input.value = item.dataset.ip;
  lookup();
});

elements.myIp.addEventListener('click', () => {
  if (myIpVal) {
    elements.input.value = myIpVal;
    lookup();
  }
});

// Init
getMyIp();
renderHistory();