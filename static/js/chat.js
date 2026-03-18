"use strict";

let currentLang = localStorage.getItem("lang") || "en";
let isLoading = false;
let chipCounter = 0;
let isRecording = false;
let recognition = null;

const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("msg-input");
const sendBtn = document.getElementById("send-btn");
const statusText = document.getElementById("status-text");
const voiceBtn = document.getElementById("voice-btn");

const UI_TEXT = {
  en: {
    sidebarSub: "AI-powered guide to Malaysian government healthcare schemes",
    pekaName: "PEKA B40",
    pekaDesc: "Free health screening",
    mysalamName: "mySALAM",
    mysalamDesc: "Critical illness cash aid",
    tbpName: "Tabung Bantuan",
    tbpDesc: "Medical assistance fund",
    madaniName: "Skim Madani",
    madaniDesc: "Free clinic treatment",
    socsoName: "SOCSO",
    socsoDesc: "Work accident protection",
    summarizeBtn: "Summarize a Policy",
    mapBtn: "Find Nearby Clinic",
    quizBtn: "Check My Eligibility",
    todayLabel: "Today",
    inputPlaceholder: "Ask about any Malaysian healthcare scheme...",
    voiceTitle: "Voice input",
    sendTitle: "Send",
    statusReady: "Online · AI-Powered",
    statusListening: "Listening...",
    statusTyping: "Typing...",
    statusSummarizing: "Summarizing...",
    micError: "Mic error: ",
    connectionError: "Connection error.",
    welcomeFallback: "Welcome! How can I help you today?",
    oosTag: "I only cover Malaysian healthcare schemes.",
    summarizeUserPrefix: "Summarize: ",
    clinicTitle: "Find a clinic near you",
    clinicSubtitle: "Tap any option to search on Google Maps",
    clinicGov: "Klinik Kesihatan (Government)",
    clinicGovSub: "Search on Google Maps →",
    clinicPeka: "PEKA B40 Panel Clinic",
    clinicPekaSub: "Search on Google Maps →",
    clinicMadani: "Skim Perubatan Madani Clinic",
    clinicMadaniSub: "Search on Google Maps →",
    clinicOfficial: "Official PEKA B40 Panel List",
    clinicOfficialSub: "Open official website →"
  },
  bm: {
    sidebarSub: "Panduan berasaskan AI untuk skim penjagaan kesihatan kerajaan Malaysia",
    pekaName: "PEKA B40",
    pekaDesc: "Saringan kesihatan percuma",
    mysalamName: "mySALAM",
    mysalamDesc: "Bantuan tunai penyakit kritikal",
    tbpName: "Tabung Bantuan",
    tbpDesc: "Dana bantuan perubatan",
    madaniName: "Skim Madani",
    madaniDesc: "Rawatan klinik percuma",
    socsoName: "SOCSO",
    socsoDesc: "Perlindungan kemalangan pekerjaan",
    summarizeBtn: "Ringkaskan Polisi",
    mapBtn: "Cari Klinik Berdekatan",
    quizBtn: "Semak Kelayakan Saya",
    todayLabel: "Hari Ini",
    inputPlaceholder: "Tanya tentang mana-mana skim penjagaan kesihatan Malaysia...",
    voiceTitle: "Input suara",
    sendTitle: "Hantar",
    statusReady: "Dalam Talian · Dikuasakan AI",
    statusListening: "Sedang mendengar...",
    statusTyping: "Sedang menaip...",
    statusSummarizing: "Sedang meringkaskan...",
    micError: "Ralat mikrofon: ",
    connectionError: "Ralat sambungan.",
    welcomeFallback: "Selamat datang! Bagaimana saya boleh membantu anda hari ini?",
    oosTag: "Saya hanya meliputi skim penjagaan kesihatan Malaysia.",
    summarizeUserPrefix: "Ringkaskan: ",
    clinicTitle: "Cari klinik berdekatan",
    clinicSubtitle: "Tekan mana-mana pilihan untuk cari di Google Maps",
    clinicGov: "Klinik Kesihatan (Kerajaan)",
    clinicGovSub: "Cari di Google Maps →",
    clinicPeka: "Klinik Panel PEKA B40",
    clinicPekaSub: "Cari di Google Maps →",
    clinicMadani: "Klinik Skim Perubatan Madani",
    clinicMadaniSub: "Cari di Google Maps →",
    clinicOfficial: "Senarai Rasmi Panel PEKA B40",
    clinicOfficialSub: "Buka laman web rasmi →"
  },
  zh: {
    sidebarSub: "由AI驱动的马来西亚政府医疗计划指南",
    pekaName: "PEKA B40",
    pekaDesc: "免费健康检查",
    mysalamName: "mySALAM",
    mysalamDesc: "重大疾病现金援助",
    tbpName: "医疗援助基金",
    tbpDesc: "医疗援助资金",
    madaniName: "Skim Madani",
    madaniDesc: "免费诊所治疗",
    socsoName: "SOCSO",
    socsoDesc: "工伤保障",
    summarizeBtn: "总结政策",
    mapBtn: "查找附近诊所",
    quizBtn: "检查我的资格",
    todayLabel: "今天",
    inputPlaceholder: "询问任何马来西亚医疗计划...",
    voiceTitle: "语音输入",
    sendTitle: "发送",
    statusReady: "在线 · AI驱动",
    statusListening: "正在聆听...",
    statusTyping: "正在输入...",
    statusSummarizing: "正在总结...",
    micError: "麦克风错误：",
    connectionError: "连接错误。",
    welcomeFallback: "欢迎！我今天可以怎样帮助您？",
    oosTag: "我只提供马来西亚医疗计划相关内容。",
    summarizeUserPrefix: "总结：",
    clinicTitle: "查找您附近的诊所",
    clinicSubtitle: "点击任一选项以在 Google Maps 中搜索",
    clinicGov: "政府诊所",
    clinicGovSub: "在 Google Maps 中搜索 →",
    clinicPeka: "PEKA B40 合作诊所",
    clinicPekaSub: "在 Google Maps 中搜索 →",
    clinicMadani: "Skim Perubatan Madani 诊所",
    clinicMadaniSub: "在 Google Maps 中搜索 →",
    clinicOfficial: "PEKA B40 官方合作诊所名单",
    clinicOfficialSub: "打开官方网站 →"
  },
  ta: {
    sidebarSub: "மலேசிய அரசு சுகாதார திட்டங்களுக்கு AI வழிகாட்டி",
    pekaName: "PEKA B40",
    pekaDesc: "இலவச சுகாதார பரிசோதனை",
    mysalamName: "mySALAM",
    mysalamDesc: "கடுமையான நோய் நிதி உதவி",
    tbpName: "மருத்துவ உதவி நிதி",
    tbpDesc: "மருத்துவ நிதி உதவி",
    madaniName: "Skim Madani",
    madaniDesc: "இலவச கிளினிக் சிகிச்சை",
    socsoName: "SOCSO",
    socsoDesc: "வேலை விபத்து பாதுகாப்பு",
    summarizeBtn: "கொள்கையை சுருக்கவும்",
    mapBtn: "அருகிலுள்ள கிளினிக் கண்டுபிடிக்கவும்",
    quizBtn: "என் தகுதியை சரிபார்க்கவும்",
    todayLabel: "இன்று",
    inputPlaceholder: "மலேசிய சுகாதார திட்டங்களைப் பற்றி கேளுங்கள்...",
    voiceTitle: "குரல் உள்ளீடு",
    sendTitle: "அனுப்பு",
    statusReady: "ஆன்லைன் · AI இயக்கம்",
    statusListening: "கேட்டுக்கொண்டு இருக்கிறது...",
    statusTyping: "தட்டச்சு செய்கிறது...",
    statusSummarizing: "சுருக்கப்படுகிறது...",
    micError: "மைக் பிழை: ",
    connectionError: "இணைப்பு பிழை.",
    welcomeFallback: "வரவேற்கிறோம்! இன்று நான் எப்படி உதவலாம்?",
    oosTag: "நான் மலேசிய சுகாதார திட்டங்களை மட்டும் விளக்குகிறேன்.",
    summarizeUserPrefix: "சுருக்கவும்: ",
    clinicTitle: "உங்களுக்கு அருகிலுள்ள கிளினிக்கை கண்டுபிடிக்கவும்",
    clinicSubtitle: "Google Maps-ல் தேட எந்த விருப்பத்தையும் அழுத்தவும்",
    clinicGov: "கிளினிக் கெசிஹாதான் (அரசு)",
    clinicGovSub: "Google Maps-ல் தேடு →",
    clinicPeka: "PEKA B40 பேனல் கிளினிக்",
    clinicPekaSub: "Google Maps-ல் தேடு →",
    clinicMadani: "Skim Perubatan Madani கிளினிக்",
    clinicMadaniSub: "Google Maps-ல் தேடு →",
    clinicOfficial: "அதிகாரப்பூர்வ PEKA B40 பேனல் பட்டியல்",
    clinicOfficialSub: "அதிகாரப்பூர்வ இணையதளத்தை திற →"
  },
  id: {
    sidebarSub: "Panduan berbasis AI untuk program kesehatan pemerintah Malaysia",
    pekaName: "PEKA B40",
    pekaDesc: "Pemeriksaan kesehatan gratis",
    mysalamName: "mySALAM",
    mysalamDesc: "Bantuan tunai penyakit kritis",
    tbpName: "Dana Bantuan Medis",
    tbpDesc: "Dana bantuan kesehatan",
    madaniName: "Skim Madani",
    madaniDesc: "Perawatan klinik gratis",
    socsoName: "SOCSO",
    socsoDesc: "Perlindungan kecelakaan kerja",
    summarizeBtn: "Ringkas Kebijakan",
    mapBtn: "Cari Klinik Terdekat",
    quizBtn: "Periksa Kelayakan Saya",
    todayLabel: "Hari Ini",
    inputPlaceholder: "Tanyakan tentang program kesehatan Malaysia apa pun...",
    voiceTitle: "Input suara",
    sendTitle: "Kirim",
    statusReady: "Online · Didukung AI",
    statusListening: "Sedang mendengarkan...",
    statusTyping: "Sedang mengetik...",
    statusSummarizing: "Sedang merangkum...",
    micError: "Kesalahan mikrofon: ",
    connectionError: "Kesalahan koneksi.",
    welcomeFallback: "Selamat datang! Bagaimana saya bisa membantu Anda hari ini?",
    oosTag: "Saya hanya membahas program kesehatan Malaysia.",
    summarizeUserPrefix: "Ringkas: ",
    clinicTitle: "Cari klinik di dekat Anda",
    clinicSubtitle: "Ketuk salah satu opsi untuk mencari di Google Maps",
    clinicGov: "Klinik Kesihatan (Pemerintah)",
    clinicGovSub: "Cari di Google Maps →",
    clinicPeka: "Klinik Panel PEKA B40",
    clinicPekaSub: "Cari di Google Maps →",
    clinicMadani: "Klinik Skim Perubatan Madani",
    clinicMadaniSub: "Cari di Google Maps →",
    clinicOfficial: "Daftar Resmi Panel PEKA B40",
    clinicOfficialSub: "Buka situs resmi →"
  },
  tl: {
    sidebarSub: "AI na gabay sa mga programang pangkalusugan ng gobyerno ng Malaysia",
    pekaName: "PEKA B40",
    pekaDesc: "Libreng health screening",
    mysalamName: "mySALAM",
    mysalamDesc: "Cash aid para sa kritikal na sakit",
    tbpName: "Pondong Medikal",
    tbpDesc: "Tulong pinansyal sa kalusugan",
    madaniName: "Skim Madani",
    madaniDesc: "Libreng klinika",
    socsoName: "SOCSO",
    socsoDesc: "Proteksyon sa aksidente sa trabaho",
    summarizeBtn: "I-summarize ang Polisiya",
    mapBtn: "Maghanap ng Malapit na Klinika",
    quizBtn: "Suriin ang Aking Kwalipikasyon",
    todayLabel: "Ngayon",
    inputPlaceholder: "Magtanong tungkol sa anumang programang pangkalusugan ng Malaysia...",
    voiceTitle: "Voice input",
    sendTitle: "Ipadala",
    statusReady: "Online · AI-Powered",
    statusListening: "Nakikinig...",
    statusTyping: "Nagta-type...",
    statusSummarizing: "Nagsa-summarize...",
    micError: "Error sa mikropono: ",
    connectionError: "Error sa koneksyon.",
    welcomeFallback: "Maligayang pagdating! Paano kita matutulungan ngayon?",
    oosTag: "Mga programang pangkalusugan ng Malaysia lang ang sakop ko.",
    summarizeUserPrefix: "I-summarize: ",
    clinicTitle: "Maghanap ng klinika malapit sa iyo",
    clinicSubtitle: "Pindutin ang alinmang opsyon para maghanap sa Google Maps",
    clinicGov: "Klinik Kesihatan (Pamahalaan)",
    clinicGovSub: "Maghanap sa Google Maps →",
    clinicPeka: "PEKA B40 Panel Clinic",
    clinicPekaSub: "Maghanap sa Google Maps →",
    clinicMadani: "Skim Perubatan Madani Clinic",
    clinicMadaniSub: "Maghanap sa Google Maps →",
    clinicOfficial: "Opisyal na Listahan ng PEKA B40 Panel",
    clinicOfficialSub: "Buksan ang opisyal na website →"
  },
  vi: {
    sidebarSub: "Hướng dẫn AI về các chương trình y tế của chính phủ Malaysia",
    pekaName: "PEKA B40",
    pekaDesc: "Khám sức khỏe miễn phí",
    mysalamName: "mySALAM",
    mysalamDesc: "Hỗ trợ tiền mặt bệnh hiểm nghèo",
    tbpName: "Quỹ Hỗ Trợ Y Tế",
    tbpDesc: "Quỹ hỗ trợ chi phí y tế",
    madaniName: "Skim Madani",
    madaniDesc: "Khám chữa bệnh miễn phí",
    socsoName: "SOCSO",
    socsoDesc: "Bảo hiểm tai nạn lao động",
    summarizeBtn: "Tóm tắt chính sách",
    mapBtn: "Tìm phòng khám gần đây",
    quizBtn: "Kiểm tra điều kiện của tôi",
    todayLabel: "Hôm nay",
    inputPlaceholder: "Hỏi về bất kỳ chương trình y tế nào của Malaysia...",
    voiceTitle: "Nhập giọng nói",
    sendTitle: "Gửi",
    statusReady: "Trực tuyến · AI hỗ trợ",
    statusListening: "Đang nghe...",
    statusTyping: "Đang nhập...",
    statusSummarizing: "Đang tóm tắt...",
    micError: "Lỗi mic: ",
    connectionError: "Lỗi kết nối.",
    welcomeFallback: "Xin chào! Hôm nay tôi có thể giúp gì cho bạn?",
    oosTag: "Tôi chỉ hỗ trợ các chương trình y tế của Malaysia.",
    summarizeUserPrefix: "Tóm tắt: ",
    clinicTitle: "Tìm phòng khám gần bạn",
    clinicSubtitle: "Nhấn vào một tùy chọn để tìm trên Google Maps",
    clinicGov: "Klinik Kesihatan (Chính phủ)",
    clinicGovSub: "Tìm trên Google Maps →",
    clinicPeka: "Phòng khám đối tác PEKA B40",
    clinicPekaSub: "Tìm trên Google Maps →",
    clinicMadani: "Phòng khám Skim Perubatan Madani",
    clinicMadaniSub: "Tìm trên Google Maps →",
    clinicOfficial: "Danh sách chính thức PEKA B40",
    clinicOfficialSub: "Mở trang web chính thức →"
  }
};

// ── UTILITIES ──────────────────────────────────────────────────────────────────
function t() {
  return UI_TEXT[currentLang] || UI_TEXT.en;
}

function getTime() {
  return new Date().toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function applyLanguage(lang) {
  currentLang = lang;
  window.currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  const text = t();

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("sidebar-sub", text.sidebarSub);
  setText("peka-name", text.pekaName);
  setText("peka-desc", text.pekaDesc);
  setText("mysalam-name", text.mysalamName);
  setText("mysalam-desc", text.mysalamDesc);
  setText("tbp-name", text.tbpName);
  setText("tbp-desc", text.tbpDesc);
  setText("madani-name", text.madaniName);
  setText("madani-desc", text.madaniDesc);
  setText("socso-name", text.socsoName);
  setText("socso-desc", text.socsoDesc);
  setText("summarize-btn", text.summarizeBtn);
  setText("map-btn", text.mapBtn);
  setText("quiz-btn", text.quizBtn);
  setText("today-label", text.todayLabel);
  setText("status-text", text.statusReady);

  if (inputEl) inputEl.placeholder = text.inputPlaceholder;
  if (voiceBtn) voiceBtn.title = text.voiceTitle;
  if (sendBtn) sendBtn.title = text.sendTitle;

  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.remove("active");
    const onclickValue = b.getAttribute("onclick") || "";
    if (onclickValue.includes(`'${lang}'`)) b.classList.add("active");
  });

  if (recognition) recognition.lang = LANG_CODES[currentLang] || "en-MY";
}

// ── VOICE INPUT ────────────────────────────────────────────────────────────────
const LANG_CODES = {
  en: "en-MY",
  bm: "ms-MY",
  zh: "zh-CN",
  ta: "ta-MY",
  id: "id-ID",
  tl: "fil-PH",
  vi: "vi-VN"
};

function initVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    if (voiceBtn) voiceBtn.style.display = "none";
    return;
  }

  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = LANG_CODES[currentLang] || "en-MY";

  recognition.onstart = () => {
    isRecording = true;
    voiceBtn.classList.add("recording");
    statusText.textContent = t().statusListening;
  };

  recognition.onresult = (e) => {
    let transcript = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    inputEl.value = transcript;
    autoResize(inputEl);
  };

  recognition.onend = () => {
    isRecording = false;
    voiceBtn.classList.remove("recording");
    statusText.textContent = t().statusReady;
    if (inputEl.value.trim()) setTimeout(() => sendMessage(), 300);
  };

  recognition.onerror = (e) => {
    isRecording = false;
    voiceBtn.classList.remove("recording");
    statusText.textContent = t().statusReady;
    if (e.error !== "aborted") {
      addBotMessage(t().micError + e.error, null, null, [], false);
    }
  };
}

function toggleVoice() {
  if (!recognition) return;
  recognition.lang = LANG_CODES[currentLang] || "en-MY";
  if (isRecording) {
    recognition.stop();
  } else {
    inputEl.value = "";
    recognition.start();
  }
}

// ── RENDER MESSAGES ────────────────────────────────────────────────────────────
function addUserMessage(text) {
  const row = document.createElement("div");
  row.className = "msg-row user";
  row.innerHTML = `
    <div class="bubble">
      <div class="msg-text">${escHtml(text)}</div>
      <span class="time">${getTime()} <span class="tick">✓✓</span></span>
    </div>
  `;
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
         </svg>${escHtml(sourceName)}
       </a>`
    : "";

  const oosHtml = outOfScope ? `<div class="oos-tag">${escHtml(t().oosTag)}</div>` : "";

  let chipsHtml = "";
  if (chips && chips.length > 0) {
    const items = chips.slice(0, 3).map((c) => ({ id: "chip-" + (++chipCounter), text: c }));
    chipsHtml = `
      <div class="chips-wrap">
        ${items.map((c) => `<button class="chip" id="${c.id}">${escHtml(c.text)}</button>`).join("")}
      </div>
    `;
    setTimeout(() => {
      items.forEach((c) => {
        const el = document.getElementById(c.id);
        if (el) el.addEventListener("click", () => sendQuick(c.text));
      });
    }, 0);
  }

  row.innerHTML = `
    <div class="bot-avatar">🤖</div>
    <div class="bubble">
      <div class="msg-text">${formatText(reply)}</div>
      ${oosHtml}
      ${sourceHtml}
      ${chipsHtml}
      <span class="time">${getTime()}</span>
    </div>
  `;
  messagesEl.appendChild(row);
  scrollDown();
}

function addTypingIndicator() {
  const row = document.createElement("div");
  row.className = "msg-row bot";
  row.id = "typing-row";
  row.innerHTML = `
    <div class="bot-avatar">🤖</div>
    <div class="bubble">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  messagesEl.appendChild(row);
  scrollDown();
}

function removeTypingIndicator() {
  const el = document.getElementById("typing-row");
  if (el) el.remove();
}

// ── LANGUAGE SWITCH ────────────────────────────────────────────────────────────
function setLang(lang, btn) {
  applyLanguage(lang);

  document.querySelectorAll(".lang-btn").forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  fetchWelcome(lang);
}

// ── WELCOME ────────────────────────────────────────────────────────────────────
async function fetchWelcome(lang) {
  try {
    const res = await fetch("/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang })
    });
    const data = await res.json();
    addBotMessage(data.reply || t().welcomeFallback, null, null, data.follow_up_chips || [], false);
  } catch {
    addBotMessage(t().welcomeFallback, null, null, [], false);
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

  if (isClinicQuery(text)) {
    addUserMessage(text);
    setTimeout(() => showClinicMap(), 300);
    return;
  }

  await processMessage(text);
}

function sendQuick(text) {
  if (isLoading) return;

  if (isClinicQuery(text)) {
    addUserMessage(text);
    setTimeout(() => showClinicMap(), 300);
    return;
  }

  processMessage(text);
}

async function processMessage(userText) {
  if (isLoading) return;

  isLoading = true;
  sendBtn.disabled = true;
  statusText.textContent = t().statusTyping;

  addUserMessage(userText);
  addTypingIndicator();

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, lang: currentLang })
    });
    const data = await res.json();

    removeTypingIndicator();

    if (data.error) {
      addBotMessage(`${data.error}`, null, null, [], false);
    } else {
      addBotMessage(
        data.reply || "Try again.",
        data.source_name || null,
        data.source_url || null,
        data.follow_up_chips || [],
        data.out_of_scope || false
      );
    }
  } catch {
    removeTypingIndicator();
    addBotMessage(t().connectionError, null, null, [], false);
  }

  isLoading = false;
  sendBtn.disabled = false;
  statusText.textContent = t().statusReady;
  inputEl.focus();
}

// ── ELIGIBILITY QUIZ ───────────────────────────────────────────────────────────
const QUIZ = {
  en: {
    q1: { text: "Let's check which schemes you qualify for!\n\nAre you a *Malaysian citizen*?", options: ["Yes", "No"] },
    q2: { text: "What is your *household income group*?", options: ["B40 (low income)", "M40 (middle income)", "Not sure"] },
    q3: { text: "Do you currently *have a job* (employed)?", options: ["Yes, employed", "No / Self-employed"] },
    q4: { text: "How old are you?", options: ["Below 40", "40 and above"] }
  },
  bm: {
    q1: { text: "Jom semak skim yang anda layak!\n\nAdakah anda *warganegara Malaysia*?", options: ["Ya", "Tidak"] },
    q2: { text: "Apakah *kumpulan pendapatan* isi rumah anda?", options: ["B40 (pendapatan rendah)", "M40 (pendapatan sederhana)", "Tidak pasti"] },
    q3: { text: "Adakah anda *bekerja* sekarang?", options: ["Ya, bekerja", "Tidak / Bekerja sendiri"] },
    q4: { text: "Berapa umur anda?", options: ["Bawah 40 tahun", "40 tahun ke atas"] }
  },
  zh: {
    q1: { text: "让我们检查您符合哪些计划！\n\n您是*马来西亚公民*吗？", options: ["是", "不是"] },
    q2: { text: "您家庭的*收入群体*是？", options: ["B40（低收入）", "M40（中等收入）", "不确定"] },
    q3: { text: "您目前*有工作*吗？", options: ["有，受雇中", "没有 / 自雇"] },
    q4: { text: "您的年龄是？", options: ["40岁以下", "40岁及以上"] }
  },
  ta: {
    q1: { text: "நீங்கள் தகுதியான திட்டங்களை சரிபார்க்கலாம்!\n\nநீங்கள் *மலேசிய குடிமகன்* ஆவீரா?", options: ["ஆம்", "இல்லை"] },
    q2: { text: "உங்கள் குடும்பத்தின் *வருமான குழு* என்ன?", options: ["B40 (குறைந்த வருமானம்)", "M40 (நடுத்தர வருமானம்)", "தெரியாது"] },
    q3: { text: "நீங்கள் தற்போது *வேலை செய்கிறீர்களா*?", options: ["ஆம், வேலை செய்கிறேன்", "இல்லை / சுய தொழில்"] },
    q4: { text: "உங்கள் வயது என்ன?", options: ["40 வயதுக்கு கீழ்", "40 வயது மற்றும் அதற்கு மேல்"] }
  },
  id: {
    q1: { text: "Mari cek skema yang kamu layak!\n\nApakah kamu *warga negara Malaysia*?", options: ["Ya", "Tidak"] },
    q2: { text: "Apa *kelompok pendapatan* rumah tanggamu?", options: ["B40 (pendapatan rendah)", "M40 (pendapatan menengah)", "Tidak tahu"] },
    q3: { text: "Apakah kamu saat ini *bekerja*?", options: ["Ya, bekerja", "Tidak / Wiraswasta"] },
    q4: { text: "Berapa umurmu?", options: ["Di bawah 40 tahun", "40 tahun ke atas"] }
  },
  tl: {
    q1: { text: "Suriin natin kung anong programa ang kwalipikado ka!\n\nIkaw ba ay *mamamayan ng Malaysia*?", options: ["Oo", "Hindi"] },
    q2: { text: "Ano ang *grupo ng kita* ng iyong sambahayan?", options: ["B40 (mababang kita)", "M40 (katamtamang kita)", "Hindi sigurado"] },
    q3: { text: "Ikaw ba ay kasalukuyang *nagtatrabaho*?", options: ["Oo, nagtatrabaho", "Hindi / Self-employed"] },
    q4: { text: "Ilang taon ka na?", options: ["Wala pang 40", "40 pataas"] }
  },
  vi: {
    q1: { text: "Hãy kiểm tra các chương trình bạn đủ điều kiện!\n\nBạn có phải là *công dân Malaysia* không?", options: ["Có", "Không"] },
    q2: { text: "Nhóm thu nhập hộ gia đình của bạn là gì?", options: ["B40 (thu nhập thấp)", "M40 (thu nhập trung bình)", "Không chắc"] },
    q3: { text: "Bạn có đang *đi làm* không?", options: ["Có, đang làm việc", "Không / Tự kinh doanh"] },
    q4: { text: "Bạn bao nhiêu tuổi?", options: ["Dưới 40 tuổi", "40 tuổi trở lên"] }
  }
};

function getRecommendations(answers, lang) {
  const schemes = [];

  const isMalaysian =
    answers[0]?.includes("Yes") ||
    answers[0]?.includes("Ya") ||
    answers[0]?.includes("Oo") ||
    answers[0]?.includes("Có") ||
    answers[0]?.includes("是") ||
    answers[0]?.includes("ஆம்");

  const isB40 =
    answers[1]?.includes("B40") ||
    answers[1]?.includes("sure") ||
    answers[1]?.includes("pasti") ||
    answers[1]?.includes("tahu") ||
    answers[1]?.includes("sigurado") ||
    answers[1]?.includes("chắc") ||
    answers[1]?.includes("不确定") ||
    answers[1]?.includes("தெரியாது");

  const isEmployed =
    answers[2]?.includes("employed") ||
    answers[2]?.includes("bekerja") ||
    answers[2]?.includes("nagtatrabaho") ||
    answers[2]?.includes("làm việc") ||
    answers[2]?.includes("受雇") ||
    answers[2]?.includes("வேலை செய்");

  const is40Plus =
    answers[3]?.includes("40 and") ||
    answers[3]?.includes("40 tahun ke") ||
    answers[3]?.includes("40 pataas") ||
    answers[3]?.includes("40 tuổi") ||
    answers[3]?.includes("40岁及") ||
    answers[3]?.includes("40 வயது மற்றும்");

  if (!isMalaysian) {
    const msgs = {
      en: "Most schemes require Malaysian citizenship. If legally employed, you may be covered by *SOCSO*.",
      bm: "Kebanyakan skim memerlukan warganegara Malaysia. Jika bekerja sah, anda mungkin dilindungi *SOCSO*.",
      zh: "大多数计划需要公民身份。如果您合法受雇，仍可受 *SOCSO* 保障。",
      ta: "பெரும்பாலான திட்டங்களுக்கு குடியுரிமை தேவை. *SOCSO* உதவலாம்.",
      id: "Kebanyakan skema memerlukan kewarganegaraan Malaysia. Jika bekerja legal, mungkin dilindungi *SOCSO*.",
      tl: "Karamihan sa mga programa ay nangangailangan ng pagkamamamayan ng Malaysia. Kung legal na nagtatrabaho, maaaring saklaw ng *SOCSO*.",
      vi: "Hầu hết các chương trình yêu cầu quốc tịch Malaysia. Nếu làm việc hợp pháp, có thể được *SOCSO* bảo vệ."
    };
    return msgs[lang] || msgs.en;
  }

  if (isB40 && is40Plus) schemes.push("*PEKA B40* — Free health screening + up to RM20,000 medical aid");
  if (isB40) schemes.push("*mySALAM* — Free takaful, RM8,000 for critical illness");
  if (isB40) schemes.push("*Skim Perubatan Madani* — Free minor illness clinic treatment");
  schemes.push("*Tabung Bantuan Perubatan* — If you cannot afford hospital bills");
  if (isEmployed) schemes.push("*SOCSO/PERKESO* — Work accident & injury protection");

  const headers = {
    en: "You may qualify for:\n\n",
    bm: "Anda mungkin layak untuk:\n\n",
    zh: "您可能符合以下计划：\n\n",
    ta: "நீங்கள் தகுதியானவர்:\n\n",
    id: "Kamu mungkin layak untuk:\n\n",
    tl: "Maaari kang kwalipikado para sa:\n\n",
    vi: "Bạn có thể đủ điều kiện cho:\n\n"
  };

  const footers = {
    en: "\n\nWant to know more about any of these?",
    bm: "\n\nIngin tahu lebih lanjut?",
    zh: "\n\n想了解哪个计划的详情？",
    ta: "\n\nமேலும் தெரிந்துகொள்ள விரும்புகிறீர்களா?",
    id: "\n\nIngin tahu lebih lanjut?",
    tl: "\n\nGusto mo bang malaman ang higit pa?",
    vi: "\n\nBạn có muốn biết thêm không?"
  };

  return (headers[lang] || headers.en) + schemes.join("\n") + (footers[lang] || footers.en);
}

let quizActive = false;
let quizStep = 0;
let quizAnswers = [];

function startQuiz() {
  if (isLoading) return;
  quizActive = true;
  quizStep = 0;
  quizAnswers = [];
  showQuizQuestion(0);
}

function showQuizQuestion(step) {
  const q = QUIZ[currentLang] || QUIZ.en;
  const keys = ["q1", "q2", "q3", "q4"];
  const question = q[keys[step]];
  if (!question) return;

  const row = document.createElement("div");
  row.className = "msg-row bot";

  const btnId = "quiz-" + (++chipCounter);
  const optionBtns = question.options
    .map((opt, i) => `<button class="quiz-option" id="${btnId}-opt-${i}">${escHtml(opt)}</button>`)
    .join("");

  row.innerHTML = `
    <div class="bot-avatar">🤖</div>
    <div class="bubble">
      <div class="msg-text">${formatText(question.text)}</div>
      <div class="quiz-options">${optionBtns}</div>
      <span class="time">${getTime()}</span>
    </div>
  `;
  messagesEl.appendChild(row);
  scrollDown();

  question.options.forEach((opt, i) => {
    const el = document.getElementById(`${btnId}-opt-${i}`);
    if (el) el.addEventListener("click", () => handleQuizAnswer(opt));
  });
}

function handleQuizAnswer(answer) {
  if (!quizActive) return;

  document.querySelectorAll(".quiz-option").forEach((b) => {
    b.disabled = true;
  });

  addUserMessage(answer);
  quizAnswers.push(answer);
  quizStep++;

  if (quizStep < 4) {
    setTimeout(() => showQuizQuestion(quizStep), 400);
  } else {
    quizActive = false;
    const result = getRecommendations(quizAnswers, currentLang);

    const chips = {
      en: ["Tell me about PEKA B40", "How to claim mySALAM?", "Find clinic near me"],
      bm: ["Cerita pasal PEKA B40", "Cara tuntut mySALAM?", "Cari klinik berhampiran"],
      zh: ["介绍PEKA B40", "如何申请mySALAM？", "找附近诊所"],
      ta: ["PEKA B40 பற்றி சொல்", "mySALAM எப்படி?", "அருகில் கிளினிக்"],
      id: ["Tentang PEKA B40", "Cara klaim mySALAM?", "Cari klinik terdekat"],
      tl: ["Tungkol sa PEKA B40", "Paano mag-claim mySALAM?", "Maghanap ng klinika"],
      vi: ["Về PEKA B40", "Cách nhận mySALAM?", "Tìm phòng khám gần đây"]
    };

    setTimeout(() => addBotMessage(result, null, null, chips[currentLang] || chips.en, false), 400);
  }
}

// ── POLICY SUMMARIZER ──────────────────────────────────────────────────────────
const SCHEMES_LIST = {
  en: [
    { key: "peka_b40", label: "PEKA B40 — Free Health Screening" },
    { key: "mysalam", label: "mySALAM — Critical Illness Aid" },
    { key: "tbp", label: "Tabung Bantuan Perubatan (TBP)" },
    { key: "madani", label: "Skim Perubatan Madani" },
    { key: "socso", label: "SOCSO — Work Accident Protection" }
  ],
  bm: [
    { key: "peka_b40", label: "PEKA B40 — Saringan Kesihatan Percuma" },
    { key: "mysalam", label: "mySALAM — Bantuan Penyakit Kritikal" },
    { key: "tbp", label: "Tabung Bantuan Perubatan (TBP)" },
    { key: "madani", label: "Skim Perubatan Madani" },
    { key: "socso", label: "SOCSO — Perlindungan Kemalangan Kerja" }
  ],
  zh: [
    { key: "peka_b40", label: "PEKA B40 — 免费健康检查" },
    { key: "mysalam", label: "mySALAM — 重大疾病援助" },
    { key: "tbp", label: "医疗援助基金 (TBP)" },
    { key: "madani", label: "Skim Perubatan Madani" },
    { key: "socso", label: "SOCSO — 工伤保护" }
  ],
  ta: [
    { key: "peka_b40", label: "PEKA B40 — இலவச சுகாதார பரிசோதனை" },
    { key: "mysalam", label: "mySALAM — கடுமையான நோய் நிதி உதவி" },
    { key: "tbp", label: "மருத்துவ உதவி நிதி (TBP)" },
    { key: "madani", label: "Skim Perubatan Madani" },
    { key: "socso", label: "SOCSO — வேலை விபத்து பாதுகாப்பு" }
  ],
  id: [
    { key: "peka_b40", label: "PEKA B40 — Pemeriksaan Kesehatan Gratis" },
    { key: "mysalam", label: "mySALAM — Bantuan Penyakit Kritis" },
    { key: "tbp", label: "Tabung Bantuan Perubatan (TBP)" },
    { key: "madani", label: "Skim Perubatan Madani" },
    { key: "socso", label: "SOCSO — Perlindungan Kecelakaan Kerja" }
  ],
  tl: [
    { key: "peka_b40", label: "PEKA B40 — Libreng Pagsusuri sa Kalusugan" },
    { key: "mysalam", label: "mySALAM — Tulong sa Kritikal na Sakit" },
    { key: "tbp", label: "Tabung Bantuan Perubatan (TBP)" },
    { key: "madani", label: "Skim Perubatan Madani" },
    { key: "socso", label: "SOCSO — Proteksyon sa Aksidente sa Trabaho" }
  ],
  vi: [
    { key: "peka_b40", label: "PEKA B40 — Khám Sức Khỏe Miễn Phí" },
    { key: "mysalam", label: "mySALAM — Hỗ Trợ Bệnh Hiểm Nghèo" },
    { key: "tbp", label: "Quỹ Hỗ Trợ Y Tế (TBP)" },
    { key: "madani", label: "Skim Perubatan Madani" },
    { key: "socso", label: "SOCSO — Bảo Vệ Tai Nạn Lao Động" }
  ]
};

const SUMMARIZE_PROMPTS = {
  en: "Please summarize this policy into exactly 3-5 simple bullet points in English. Each point should be one short sentence a non-educated person can understand. Focus on: who is eligible, what benefits they get, and how to apply. Start each bullet with •",
  bm: "Sila ringkaskan polisi ini kepada tepat 3-5 mata poin mudah dalam Bahasa Malaysia. Setiap poin hendaklah ayat pendek yang mudah difahami. Fokus: siapa layak, faedah, cara mohon. Mulakan setiap poin dengan •",
  zh: "请将此政策总结为3-5个简单要点，用简体中文。每个要点是普通人能理解的简短句子。重点：谁有资格、获得什么福利、如何申请。每点以•开始",
  ta: "இந்த கொள்கையை தமிழில் 3-5 எளிய புள்ளிகளாக சுருக்கவும். ஒவ்வொரு புள்ளியும் குறுகிய வாக்கியமாக இருக்க வேண்டும். • என்று தொடங்கவும்",
  id: "Ringkas kebijakan ini menjadi 3-5 poin sederhana dalam Bahasa Indonesia. Setiap poin kalimat pendek yang mudah dipahami. Fokus: siapa berhak, manfaat, cara daftar. Mulai setiap poin dengan •",
  tl: "Buod ang patakaran sa 3-5 simpleng puntos sa Filipino. Bawat puntos isang maikling pangungusap. Tukuyin: sino kwalipikado, benepisyo, paano mag-apply. Simulan ang bawat puntos ng •",
  vi: "Tóm tắt chính sách thành 3-5 điểm đơn giản bằng tiếng Việt. Mỗi điểm một câu ngắn. Tập trung: ai đủ điều kiện, lợi ích, cách đăng ký. Bắt đầu mỗi điểm bằng •"
};

const SUMMARIZE_HEADERS = {
  en: "Which policy would you like me to summarize?",
  bm: "Polisi mana yang anda ingin saya ringkaskan?",
  zh: "您想让我总结哪个政策？",
  ta: "எந்த கொள்கையை சுருக்க வேண்டும்?",
  id: "Kebijakan mana yang ingin Anda ringkas?",
  tl: "Aling patakaran ang gusto mong ibuod?",
  vi: "Bạn muốn tôi tóm tắt chính sách nào?"
};

function showSummarizeMenu() {
  if (isLoading) return;

  const schemes = SCHEMES_LIST[currentLang] || SCHEMES_LIST.en;
  const row = document.createElement("div");
  row.className = "msg-row bot";
  const menuId = "sum-" + (++chipCounter);

  const optionBtns = schemes.map((s, i) =>
    `<button class="quiz-option" id="${menuId}-${i}" style="text-align:left;padding:10px 14px;margin-bottom:4px;width:100%;">${escHtml(s.label)}</button>`
  ).join("");

  row.innerHTML = `
    <div class="bot-avatar">🤖</div>
    <div class="bubble" style="max-width:92%;">
      <div class="msg-text" style="margin-bottom:10px;">${escHtml(SUMMARIZE_HEADERS[currentLang] || SUMMARIZE_HEADERS.en)}</div>
      <div style="display:flex;flex-direction:column;gap:4px;">${optionBtns}</div>
      <span class="time">${getTime()}</span>
    </div>
  `;
  messagesEl.appendChild(row);
  scrollDown();

  schemes.forEach((s, i) => {
    const el = document.getElementById(`${menuId}-${i}`);
    if (el) {
      el.addEventListener("click", () => {
        document.querySelectorAll(`[id^="${menuId}"]`).forEach((b) => {
          b.disabled = true;
        });
        runSummarize(s.key, s.label);
      });
    }
  });
}

async function runSummarize(schemeKey, schemeLabel) {
  addUserMessage(t().summarizeUserPrefix + schemeLabel);
  addTypingIndicator();
  isLoading = true;
  sendBtn.disabled = true;
  statusText.textContent = t().statusSummarizing;

  const prompt = (SUMMARIZE_PROMPTS[currentLang] || SUMMARIZE_PROMPTS.en) + " Scheme: " + schemeKey;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt, lang: currentLang })
    });
    const data = await res.json();

    removeTypingIndicator();

    if (data.error) {
      addBotMessage(`${data.error}`, null, null, [], false);
    } else {
      addBotMessage(
        data.reply || "Could not summarize. Try again.",
        data.source_name || null,
        data.source_url || null,
        data.follow_up_chips || [],
        false
      );
    }
  } catch {
    removeTypingIndicator();
    addBotMessage(t().connectionError, null, null, [], false);
  }

  isLoading = false;
  sendBtn.disabled = false;
  statusText.textContent = t().statusReady;
  inputEl.focus();
}

// ── CLINIC MAP ─────────────────────────────────────────────────────────────────
const CLINIC_KEYWORDS = [
  "clinic", "klinik", "诊所", "கிளினிக்", "nearby", "near me", "berhampiran",
  "附近", "அருகில்", "find clinic", "cari klinik", "找诊所", "hospital"
];

function isClinicQuery(text) {
  const lower = text.toLowerCase();
  return CLINIC_KEYWORDS.some((kw) => lower.includes(kw));
}

function showClinicMap() {
  const text = t();
  const row = document.createElement("div");
  row.className = "msg-row bot";

  row.innerHTML = `
    <div class="bot-avatar">🤖</div>
    <div class="bubble" style="max-width:92%;padding:12px;">
      <div style="line-height:1.3;">
        <strong style="display:block; margin-bottom:4px;">
          ${escHtml(text.clinicTitle)}
        </strong>
        <span style="font-size:12px;color:#666; display:block; margin-bottom:10px;">
          ${escHtml(text.clinicSubtitle)}
        </span>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <a href="https://www.google.com/maps/search/klinik+kesihatan/" target="_blank"
           style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#E8F5E9;border:1px solid #A5D6A7;border-radius:10px;text-decoration:none;">
          <div>
            <div style="font-size:13px;font-weight:600;color:#1B5E20;">${escHtml(text.clinicGov)}</div>
            <div style="font-size:11px;color:#388E3C;">${escHtml(text.clinicGovSub)}</div>
          </div>
        </a>

        <a href="https://www.google.com/maps/search/klinik+peka+b40+panel/" target="_blank"
           style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#E3F2FD;border:1px solid #90CAF9;border-radius:10px;text-decoration:none;">
          <div>
            <div style="font-size:13px;font-weight:600;color:#0D47A1;">${escHtml(text.clinicPeka)}</div>
            <div style="font-size:11px;color:#1565C0;">${escHtml(text.clinicPekaSub)}</div>
          </div>
        </a>

        <a href="https://www.google.com/maps/search/klinik+skim+perubatan+madani/" target="_blank"
           style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F3E5F5;border:1px solid #CE93D8;border-radius:10px;text-decoration:none;">
          <div>
            <div style="font-size:13px;font-weight:600;color:#4A148C;">${escHtml(text.clinicMadani)}</div>
            <div style="font-size:11px;color:#6A1B9A;">${escHtml(text.clinicMadaniSub)}</div>
          </div>
        </a>

        <a href="https://bms.pekab40.com.my/provider" target="_blank"
           style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#FFF8E1;border:1px solid #FFE082;border-radius:10px;text-decoration:none;">
          <div>
            <div style="font-size:13px;font-weight:600;color:#E65100;">${escHtml(text.clinicOfficial)}</div>
            <div style="font-size:11px;color:#F57C00;">${escHtml(text.clinicOfficialSub)}</div>
          </div>
        </a>
      </div>

      <span class="time">${getTime()}</span>
    </div>
  `;
  messagesEl.appendChild(row);
  scrollDown();
}

// ── INIT ───────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLang);
  initVoice();
  fetchWelcome(currentLang);

  window.currentLang = currentLang;
  window.processMessage = processMessage;
  window.showSummarizeMenu = showSummarizeMenu;
  window.showClinicMap = showClinicMap;
  window.startQuiz = startQuiz;
  window.setLang = setLang;
});