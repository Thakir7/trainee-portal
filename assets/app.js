// ✅ رابط Web App الصحيح
const API_URL = "https://script.google.com/macros/s/AKfycbw2Uqi5HXSamWWIGpsqeNU3nBQ2Z9ZMHhGc28bx0ZKhcnyP54-gAo-KsYYIX2NPIiFh9w/exec";

// ===== أدوات =====
function qs(id){ return document.getElementById(id); }

function setText(id, v){
  const el = qs(id);
  if (!el) return;
  el.textContent = (v !== undefined && v !== null && String(v).trim() !== "") ? v : "-";
}

function showError(id, msg){
  const el = qs(id);
  if (!el) return;
  el.textContent = msg || "";
  el.style.display = msg ? "block" : "none";
}

// ===== جلسة المتدرب (متوافقة مع القديم والجديد) =====
const LS_KEY = "trainee_session";
const SS_KEY = "trainee";

function saveSession(trainee){
  const payload = JSON.stringify(trainee);
  localStorage.setItem(LS_KEY, payload);
  sessionStorage.setItem(SS_KEY, payload);
}

function getSession(){
  let raw = localStorage.getItem(LS_KEY);
  if (raw) { try { return JSON.parse(raw); } catch {} }

  raw = sessionStorage.getItem(SS_KEY);
  if (raw) {
    try {
      const s = JSON.parse(raw);
      if (s?.id) localStorage.setItem(LS_KEY, JSON.stringify(s));
      return s;
    } catch {}
  }
  return null;
}

function clearSession(){
  localStorage.removeItem(LS_KEY);
  sessionStorage.removeItem(SS_KEY);
}

function isIndexPage(){
  const p = (location.pathname || "").toLowerCase();
  return p.endsWith("/trainee-portal/") || p.endsWith("/trainee-portal") || p.endsWith("/index.html");
}

function requireSession(){
  const s = getSession();
  if (!s || !s.id){
    if (!isIndexPage()) location.replace("index.html");
    return null;
  }
  return s;
}

// ===== API GET =====
async function apiGet(params){
  if (!API_URL || !API_URL.startsWith("http")) throw new Error("API_URL not set");
  params._t = Date.now();
  const url = API_URL + "?" + new URLSearchParams(params).toString();

  const res = await fetch(url, { method:"GET" });
  const text = await res.text();

  // حماية لو رجع HTML بدل JSON
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error("API did not return JSON"); }

  return data;
}

async function searchTraineeById(id){
  const data = await apiGet({ action:"trainee", id });
  if (data?.ok && data?.trainee) return data.trainee;
  return null;
}

function fillHeaderFromSession(){
  const s = getSession();
  if (!s) return;
  setText("vName", s.name);
  setText("vId", s.id);
  setText("vAdvisor", s.advisor);
}

