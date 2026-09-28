// ---------- 1. Typing effect ----------
const words = ["Frontend Developer","Web Designer","Quick Learner","AI-Assisted Builder"];
let w = 0, c = 0, deleting = false;
const typing = document.getElementById("typing");
function type(){
  const word = words[w];
  typing.textContent = word.slice(0, c);
  if(!deleting && c < word.length){ c++; setTimeout(type, 90); }
  else if(!deleting){ deleting = true; setTimeout(type, 1200); }
  else if(c > 0){ c--; setTimeout(type, 45); }
  else { deleting = false; w = (w + 1) % words.length; setTimeout(type, 300); }
}
type();

// ---------- 2. Light / dark theme ----------
const root = document.documentElement;
const btn = document.getElementById("theme");
function setTheme(t){ root.setAttribute("data-theme", t); btn.textContent = t === "dark" ? "☀️" : "🌙"; }
let saved = null;
try { saved = localStorage.getItem("theme"); } catch(e){}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
btn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
  try { localStorage.setItem("theme", next); } catch(e){}
});

// ---------- Mobile menu ----------
const menu = document.getElementById("menu");
const links = document.querySelector(".links");
menu.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menu.textContent = open ? "✕" : "☰";
});
links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  links.classList.remove("open"); menu.textContent = "☰";
}));

// ---------- 3. Reveal on scroll ----------
const io = new IntersectionObserver(items => {
  items.forEach(i => { if(i.isIntersecting) i.target.classList.add("show"); });
}, {threshold: .1});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---------- 4. Contact form (validates, then opens your email app) ----------
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const text = document.getElementById("text").value.trim();
  const msg = document.getElementById("msg");
  if(!name || !text){ msg.style.color = "#e11d48"; msg.textContent = "Please enter your name and message."; return; }
  if(!/^\S+@\S+\.\S+$/.test(email)){ msg.style.color = "#e11d48"; msg.textContent = "Please enter a valid email."; return; }
  msg.style.color = "#16a34a"; msg.textContent = "Opening your email app...";
  location.href = "mailto:arjuntej121@gmail.com?subject=" + encodeURIComponent("Portfolio message from " + name) +
    "&body=" + encodeURIComponent(text + "\n\nFrom: " + name + " (" + email + ")");
});

document.getElementById("year").textContent = new Date().getFullYear();
