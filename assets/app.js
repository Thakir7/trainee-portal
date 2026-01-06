/***************
 * رابط الـ Web App (ضع رابطك العام بدون u/1)
 ***************/
const API_URL = "https://script.google.com/macros/s/AKfycbwhKWBTnVIpUUr3qvFz_bJ62dCpqH869d6-umOfATVE-HmvbTFhUCdC27XtkM6HRlxa-A/exec";

/***************
 * أدوات عامة
 ***************/
function qs(id){ return document.getElementById(id); }

function setText(id, v){
  const el = qs(id);
  if (el) el.textContent = (v !== undefined && v !== null && String(v).trim() !== "") ? v : "-";
}

function showError(id, msg){
  const el = qs(id);
  if (!el) return;
  el.textContent = msg;
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
  if (!API_URL || !API_URL.startsWith("http")) throw new Error("API_URL not set");
  params._t = Date.now(); // ✅ كسر الكاش
  const url = API_URL + "?" + new URLSearchParams(params).toString();

  const res = await fetch(url, { method:"GET" });
  // لو مو JSON راح يفشل هنا ويطلع catch في الصفحات
  const data = await res.json();
  return data;
}

/***************

 ***************/
async function searchTraineeById(id){
  const data = await apiGet({ action:"trainee", id });
  if (data?.ok && data?.trainee) return data.trainee;
  return null;
}
