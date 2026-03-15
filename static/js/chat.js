"use strict";

let currentLang = "en";
let isLoading   = false;
let chipCounter = 0; // unique IDs for chip click handlers

const messagesEl = document.getElementById("messages");
const inputEl    = document.getElementById("msg-input");
const sendBtn    = document.getElementById("send-btn");
const statusText = document.getElementById("status-text");

// ── UTILITIES ──────────────────────────────────────────────────────────────────
function getTime() {
  return new Date().toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function formatText(str) {
  return escHtml(str)
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}
function scrollDown() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

// ── RENDER MESSAGES ────────────────────────────────────────────────────────────
function addUserMessage(text) {
  const row = document.createElement("div");
  row.className = "msg-row user";
  row.innerHTML = `
    <div class="bubble">
      <div class="msg-text">${escHtml(text)}</div>
      <span class="time">${getTime()} <span class="tick">✓✓</span></span>
    </div>`;
  messagesEl.appendChild(row);
  scrollDown();
}

function addBotMessage(reply, sourceName, sourceUrl, chips, outOfScope) {
  const row = document.createElement("div");
  row.className = "msg-row bot";

  const sourceHtml = (sourceName && sourceUrl)
    ? `<a class="source-tag" href="${escHtml(sourceUrl)}" target="_blank" rel="noopener">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" stroke-width="2.5">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        ${escHtml(sourceName)}
      </a>` : "";

  const oosHtml = outOfScope
    ? `<div class="oos-tag"> I only cover Malaysian healthcare schemes.</div>` : "";

  let chipsHtml = "";
  if (chips && chips.length > 0) {
    const chipItems = chips.slice(0, 3).map(c => {
      const id = "chip-" + (++chipCounter);
      return { id, text: c };
    });
    chipsHtml = `<div class="chips-wrap">${chipItems.map(c =>
      `<button class="chip" id="${c.id}">${escHtml(c.text)}</button>`
    ).join("")}</div>`;

    setTimeout(() => {
      chipItems.forEach(c => {
        const el = document.getElementById(c.id);
        if (el) el.addEventListener("click", () => sendQuick(c.text));
      });
    }, 0);
  }

  row.innerHTML = `
    <div class="bubble">
      <div class="msg-text">${formatText(reply)}</div>
      ${oosHtml}
      ${sourceHtml}
      ${chipsHtml}
      <span class="time">${getTime()}</span>
    </div>`;
  messagesEl.appendChild(row);
  scrollDown();
}

function addTypingIndicator() {
  const row = document.createElement("div");
  row.className = "msg-row bot";
  row.id = "typing-row";
  row.innerHTML = `
    <div class="bubble">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
  messagesEl.appendChild(row);
  scrollDown();
}
function removeTypingIndicator() {
  const el = document.getElementById("typing-row");
  if (el) el.remove();
}

// ── LANGUAGE SWITCH ────────────────────────────────────────────────────────────
function setLang(lang, btn) {
  currentLang = lang;
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  fetchWelcome(lang);
}

async function fetchWelcome(lang) {
  try {
    const res  = await fetch("/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    });
    const data = await res.json();
    addBotMessage(data.reply, null, null, data.follow_up_chips, false);
  } catch {
    addBotMessage(" Welcome! How can I help you today?", null, null, [], false);
  }
}

// ── SEND LOGIC ─────────────────────────────────────────────────────────────────
function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text || isLoading) return;
  inputEl.value = "";
  autoResize(inputEl);
  await processMessage(text);
}

function sendQuick(text) {
  if (isLoading) return;
  processMessage(text);
}

async function processMessage(userText) {
  if (isLoading) return;
  isLoading = true;
  sendBtn.disabled = true;
  statusText.textContent = "typing...";

  addUserMessage(userText);
  addTypingIndicator();

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, lang: currentLang }),
    });
    const data = await res.json();
    removeTypingIndicator();

    if (data.error) {
      addBotMessage(` ${data.error}`, null, null, [], false);
    } else {
      addBotMessage(
        data.reply || "I had trouble with that. Please try again.",
        data.source_name  || null,
        data.source_url   || null,
        data.follow_up_chips || [],
        data.out_of_scope || false
      );
    }
  } catch (err) {
    removeTypingIndicator();
    addBotMessage("Connection error. Please check the server is running.", null, null, [], false);
    console.error("Fetch error:", err);
  }

  isLoading = false;
  sendBtn.disabled = false;
  statusText.textContent = "Online · AI-Powered";
  inputEl.focus();
}

document.addEventListener("DOMContentLoaded", () => fetchWelcome("en"));
