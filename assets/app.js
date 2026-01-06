/***************
 * 
 ***************/
const API_URL = "https://script.google.com/macros/s/AKfycbw2Uqi5HXSamWWIGpsqeNU3nBQ2Z9ZMHhGc28bx0ZKhcnyP54-gAo-KsYYIX2NPIiFh9w/exec";

/***************
 * أدوات عامة
 ***************/
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

/***************
 * جلسة المتدرب
 ***************/
function saveSession(trainee){
  localStorage.setItem("trainee_session", JSON.stringify(trainee));
}

function getSession(){
  const raw = localStorage.getItem("trainee_session");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function clearSession(){
  localStorage.removeItem("trainee_session");
}

function requireSession(){
  const s = getSession();
  if (!s || !s.id) {
    window.location.href = "index.html";
    return null;
  }
  return s;
}

/***************
 * API GET (مع كسر الكاش)
 ***************/
async function apiGet(params){
  if (!API_URL || !API_URL.startsWith("http")) {
    throw new Error("API_URL غير مضبوط في assets/app.js");
  }
  params._t = Date.now(); // ✅ كسر الكاش
  const url = API_URL + "?" + new URLSearchParams(params).toString();
  const res = await fetch(url, { method:"GET" });

  // لو رجع HTML أو خطأ، هذا السطر سيكشف المشكلة
  const data = await res.json();
  return data;
}

async function searchTraineeById(id){
  const data = await apiGet({ action:"trainee", id });
  if (data?.ok && data?.trainee) return data.trainee;
  return null;
}

