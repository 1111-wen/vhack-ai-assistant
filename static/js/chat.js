"use strict";

let currentLang = localStorage.getItem("lang") || "en";
let isLoading = false;
let chipCounter = 0;
let isRecording = false;
let recognition = null;
let currentTopic = "general";

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

function normalizeText(text) {
  return String(text || "").toLowerCase().trim();
}

function detectTopic(text) {
  const lower = normalizeText(text);

  if (lower.includes("mysalam") || lower.includes("my salam") || lower.includes("my-salam")) {
    return "mysalam";
  }
  if (lower.includes("peka b40") || lower === "peka" || lower.includes(" peka ")) {
    return "peka_b40";
  }
  if (lower.includes("socso") || lower.includes("perkeso")) {
    return "socso";
  }
  if (lower.includes("madani") || lower.includes("skim perubatan madani")) {
    return "madani";
  }
  if (lower.includes("tabung bantuan perubatan") || lower.includes("tabung bantuan") || lower.includes("tbp")) {
    return "tbp";
  }

  return null;
}

function updateTopicFromText(text) {
  const topic = detectTopic(text);
  if (topic) currentTopic = topic;
}

function isApplyQuestion(text) {
  const lower = normalizeText(text);
  return (
    lower.includes("how to apply") ||
    lower.includes("how do i apply") ||
    lower.includes("claim mysalam") ||

    lower.includes("bagaimana nak daftar") ||
    lower.includes("bagaimana daftar") ||
    lower.includes("cara daftar") ||
    lower.includes("cara mohon") ||
    lower.includes("cara tuntut mysalam") ||
    lower.includes("tuntut mysalam") ||
    lower.includes("macam mana nak daftar") ||

    lower.includes("如何申请") ||
    lower.includes("怎么申请") ||
    lower.includes("如何索赔") ||

    lower.includes("எப்படி விண்ணப்ப") ||
    lower.includes("எப்படி பதிவு") ||
    lower.includes("எப்படி கோருவது") ||

    lower.includes("cara klaim") ||

    lower.includes("paano mag-apply") ||
    lower.includes("paano mag-claim") ||

    lower.includes("cách đăng ký") ||
    lower.includes("cách nhận")
  );
}

function isEligibilityQuestion(text) {
  const lower = normalizeText(text);
  return (
    lower.includes("who can get") ||
    lower.includes("who is eligible") ||
    lower.includes("am i eligible") ||
    lower.includes("eligible") ||

    lower.includes("siapa yang layak") ||
    lower.includes("siapa layak") ||
    lower.includes("adakah saya layak") ||
    lower.includes("layak") ||

    lower.includes("谁可以获得") ||
    lower.includes("谁符合资格") ||
    lower.includes("我符合资格吗") ||

    lower.includes("யார் தகுதியானவர்") ||
    lower.includes("நான் தகுதியானவரா") ||
    lower.includes("தகுதி") ||

    lower.includes("siapa yang berhak") ||
    lower.includes("apakah saya layak") ||

    lower.includes("sino ang kwalipikado") ||
    lower.includes("kwalipikado") ||

    lower.includes("ai đủ điều kiện") ||
    lower.includes("tôi có đủ điều kiện")
  );
}

function isCoverageQuestion(text) {
  const lower = normalizeText(text);
  return (
    lower.includes("what does it cover") ||
    lower.includes("what benefits") ||
    lower.includes("benefits") ||
    lower.includes("cover") ||

    lower.includes("apa sahaja bantuan") ||
    lower.includes("apa saja bantuan") ||
    lower.includes("apa yang dilindungi") ||
    lower.includes("faedah") ||
    lower.includes("manfaat") ||

    lower.includes("涵盖什么") ||
    lower.includes("有什么保障") ||
    lower.includes("有什么福利") ||

    lower.includes("என்ன கவர்") ||
    lower.includes("என்ன உதவி") ||
    lower.includes("என்ன நன்மை") ||

    lower.includes("ano ang benepisyo") ||
    lower.includes("anong sakop") ||

    lower.includes("bao gồm gì") ||
    lower.includes("quyền lợi gì")
  );
}

function isClinicFollowupQuestion(text) {
  const lower = normalizeText(text);
  return (
    lower.includes("how to find clinics") ||
    lower.includes("find clinic") ||
    lower.includes("find clinics") ||
    lower.includes("clinic near me") ||
    lower.includes("nearby clinic") ||

    lower.includes("di mana klinik terdekat") ||
    lower.includes("cari klinik") ||
    lower.includes("klinik terdekat") ||
    lower.includes("klinik berhampiran") ||

    lower.includes("找附近诊所") ||
    lower.includes("附近诊所") ||
    lower.includes("诊所") ||

    lower.includes("அருகில் கிளினிக்") ||
    lower.includes("கிளினிக்") ||

    lower.includes("maghanap ng klinika") ||
    lower.includes("klinika") ||

    lower.includes("tìm phòng khám") ||
    lower.includes("phòng khám gần")
  );
}

function localTopicText() {
  const L = currentLang;

  const data = {
    en: {
      pekaApply:
        "To use *PEKA B40*:\n\n" +
        "• First, check if you are eligible.\n" +
        "• If eligible, visit a *registered PEKA B40 panel clinic*.\n" +
        "• Bring your *MyKad / IC* for verification.\n" +
        "• The clinic will guide you for screening and next steps.",
      pekaEligibility:
        "*PEKA B40* is generally for Malaysians in the *B40 group*, especially those *aged 40 and above*.\n\n" +
        "• You can check eligibility on the official PEKA B40 site.\n" +
        "• Bring your IC when visiting a panel clinic.",
      pekaCoverage:
        "*PEKA B40* helps with:\n\n" +
        "• Free health screening\n" +
        "• Help for some medical devices\n" +
        "• Incentives for certain cancer treatments\n" +
        "• Transport incentive for treatment visits",
      mysalamApply:
        "For *mySALAM*:\n\n" +
        "• Usually there is *no manual registration*.\n" +
        "• If you are eligible, your status is based on government records.\n" +
        "• Check your eligibility on the official mySALAM website.\n" +
        "• If eligible, follow the claim steps shown there.",
      mysalamEligibility:
        "*mySALAM* is for eligible Malaysians under the approved government group.\n\n" +
        "• Check your status on the official mySALAM website.\n" +
        "• Eligibility is usually based on government records.",
      mysalamCoverage:
        "*mySALAM* may provide:\n\n" +
        "• Financial aid for certain critical illnesses\n" +
        "• Hospitalisation income support for eligible cases\n" +
        "• Protection to reduce the burden of medical costs",
      tbpApply:
        "For *Tabung Bantuan Perubatan (TBP)*:\n\n" +
        "• You must be referred by a *government hospital*.\n" +
        "• The hospital will assess your financial situation.\n" +
        "• Submit required documents through the hospital.\n" +
        "• Approval depends on medical and financial need.",

      tbpEligibility:
        "*Tabung Bantuan Perubatan (TBP)* is for Malaysians who:\n\n" +
        "• Cannot afford treatment costs\n" +
        "• Receive treatment at government hospitals\n" +
        "• Meet financial assessment requirements",

      tbpCoverage:
        "*TBP* may help cover:\n\n" +
        "• Cost of medical treatment\n" +
        "• Medical equipment\n" +
        "• Certain procedures at government hospitals",
      socsoApply:
        "For *SOCSO / PERKESO*:\n\n" +
        "• Employees are usually registered by their employer.\n" +
        "• Employers make contributions for eligible workers.\n" +
        "• For claims, supporting documents may need to be submitted to PERKESO.",
      socsoEligibility:
        "*SOCSO / PERKESO* mainly covers eligible employees in Malaysia.\n\n" +
        "• Coverage depends on employment status and contribution rules.",
      socsoCoverage:
        "*SOCSO / PERKESO* may provide:\n\n" +
        "• Medical benefits\n" +
        "• Work injury protection\n" +
        "• Rehabilitation support\n" +
        "• Other benefits depending on the case",
      madaniApply:
        "To use *Skim Perubatan Madani*:\n\n" +
        "• Check whether you are eligible.\n" +
        "• Visit a participating clinic.\n" +
        "• Show your IC for verification.\n" +
        "• The clinic will confirm whether the visit is covered.",
      madaniEligibility:
        "Eligibility for *Skim Perubatan Madani* depends on the approved beneficiary group under the scheme.\n\n" +
        "• You can check using the official portal or clinic verification.",
      madaniCoverage:
        "*Skim Perubatan Madani* mainly covers treatment for *minor illnesses* at participating private clinics, subject to the package rules.",
      whoChip: "Who can get this?",
      coverChip: "What does it cover?",
      applyChip: "How to apply?",
      clinicChip: "How to find clinics?",
      claimMySalamChip: "How to claim mySALAM?"
    },

    bm: {
  pekaApply:
    "Untuk menggunakan *PEKA B40*:\n\n" +
    "• Mula-mula, semak sama ada anda layak.\n" +
    "• Jika layak, pergi ke *klinik panel PEKA B40* yang berdaftar.\n" +
    "• Bawa *MyKad / IC* untuk pengesahan.\n" +
    "• Klinik akan bantu anda untuk saringan dan langkah seterusnya.",
  pekaEligibility:
    "*PEKA B40* biasanya untuk rakyat Malaysia dalam kumpulan *B40*, terutama yang *berumur 40 tahun ke atas*.\n\n" +
    "• Anda boleh semak kelayakan di laman rasmi PEKA B40.\n" +
    "• Bawa IC semasa pergi ke klinik panel.",
  pekaCoverage:
    "*PEKA B40* membantu dengan:\n\n" +
    "• Saringan kesihatan percuma\n" +
    "• Bantuan untuk beberapa alat perubatan\n" +
    "• Insentif bagi rawatan kanser tertentu\n" +
    "• Insentif pengangkutan untuk lawatan rawatan",
  tbpApply:
    "Untuk *Tabung Bantuan Perubatan (TBP)*:\n\n" +
    "• Anda perlu dirujuk oleh *hospital kerajaan*.\n" +
    "• Pihak hospital akan menilai keadaan kewangan anda.\n" +
    "• Hantar dokumen yang diperlukan melalui hospital.\n" +
    "• Kelulusan bergantung pada keperluan perubatan dan kewangan.",

  tbpEligibility:
    "*Tabung Bantuan Perubatan (TBP)* adalah untuk rakyat Malaysia yang:\n\n" +
    "• Tidak mampu menanggung kos rawatan\n" +
    "• Menerima rawatan di hospital kerajaan\n" +
    "• Memenuhi syarat penilaian kewangan",

  tbpCoverage:
    "*TBP* boleh membantu menampung:\n\n" +
    "• Kos rawatan perubatan\n" +
    "• Peralatan perubatan\n" +
    "• Beberapa prosedur tertentu di hospital kerajaan",
  mysalamApply:
    "Untuk *mySALAM*:\n\n" +
    "• Biasanya *tidak perlu daftar secara manual*.\n" +
    "• Jika anda layak, status anda berdasarkan rekod kerajaan.\n" +
    "• Semak kelayakan di laman rasmi mySALAM.\n" +
    "• Jika layak, ikut langkah tuntutan yang ditunjukkan di sana.",
  mysalamEligibility:
    "*mySALAM* adalah untuk rakyat Malaysia yang layak di bawah kumpulan kerajaan yang diluluskan.\n\n" +
    "• Semak status anda di laman rasmi mySALAM.\n" +
    "• Kelayakan biasanya berdasarkan rekod kerajaan.",
  mysalamCoverage:
    "*mySALAM* boleh memberi:\n\n" +
    "• Bantuan kewangan untuk penyakit kritikal tertentu\n" +
    "• Sokongan pendapatan hospital bagi kes yang layak\n" +
    "• Perlindungan untuk mengurangkan beban kos perubatan",
  socsoApply:
    "Untuk *SOCSO / PERKESO*:\n\n" +
    "• Pekerja biasanya didaftarkan oleh majikan.\n" +
    "• Majikan membuat caruman untuk pekerja yang layak.\n" +
    "• Untuk tuntutan, dokumen sokongan mungkin perlu dihantar kepada PERKESO.",
  socsoEligibility:
    "*SOCSO / PERKESO* terutamanya melindungi pekerja yang layak di Malaysia.\n\n" +
    "• Perlindungan bergantung pada status pekerjaan dan peraturan caruman.",
  socsoCoverage:
    "*SOCSO / PERKESO* boleh menyediakan:\n\n" +
    "• Faedah perubatan\n" +
    "• Perlindungan kecederaan kerja\n" +
    "• Sokongan pemulihan\n" +
    "• Faedah lain bergantung pada kes",
  madaniApply:
    "Untuk menggunakan *Skim Perubatan Madani*:\n\n" +
    "• Semak sama ada anda layak.\n" +
    "• Pergi ke klinik yang mengambil bahagian.\n" +
    "• Tunjukkan IC untuk pengesahan.\n" +
    "• Klinik akan sahkan sama ada lawatan anda dilindungi.",
  madaniEligibility:
    "Kelayakan untuk *Skim Perubatan Madani* bergantung pada kumpulan penerima yang diluluskan di bawah skim ini.\n\n" +
    "• Anda boleh semak melalui portal rasmi atau pengesahan klinik.",
  madaniCoverage:
    "*Skim Perubatan Madani* terutamanya meliputi rawatan untuk *penyakit ringan* di klinik swasta yang mengambil bahagian, tertakluk kepada peraturan pakej.",
  whoChip: "Siapa layak?",
  coverChip: "Faedah apa?",
  applyChip: "Macam mana mohon?",
  clinicChip: "Klinik mana?",
  claimMySalamChip: "Cara tuntut mySALAM?"
},

    zh: {
      pekaApply:
        "使用 *PEKA B40* 的方式：\n\n" +
        "• 先检查自己是否符合资格。\n" +
        "• 如果符合资格，请前往*已注册的 PEKA B40 合作诊所*。\n" +
        "• 带上 *MyKad / 身份证* 进行核实。\n" +
        "• 诊所会指导您进行健康筛查和后续步骤。",
      pekaEligibility:
        "*PEKA B40* 一般适用于 *B40 低收入群体* 的马来西亚公民，尤其是 *40 岁及以上* 的人士。\n\n" +
        "• 您可以在 PEKA B40 官方网站查询资格。\n" +
        "• 去合作诊所时请带上身份证。",
      pekaCoverage:
        "*PEKA B40* 可提供：\n\n" +
        "• 免费健康检查\n" +
        "• 某些医疗器材援助\n" +
        "• 某些癌症治疗补助\n" +
        "• 治疗交通津贴",
      tbpApply:
        "关于 *Tabung Bantuan Perubatan (TBP)*：\n\n" +
        "• 您需要由*政府医院*转介。\n" +
        "• 医院会评估您的经济情况。\n" +
        "• 通过医院提交所需文件。\n" +
        "• 是否获批取决于医疗和经济需要。",

      tbpEligibility:
        "*Tabung Bantuan Perubatan (TBP)* 适用于以下马来西亚人：\n\n" +
        "• 无法承担治疗费用\n" +
        "• 在政府医院接受治疗\n" +
        "• 符合经济评估要求",

      tbpCoverage:
        "*TBP* 可帮助支付：\n\n" +
        "• 医疗治疗费用\n" +
        "• 医疗设备\n" +
        "• 政府医院的某些特定程序",
      mysalamApply:
        "关于 *mySALAM*：\n\n" +
        "• 一般来说，*不需要手动注册*。\n" +
        "• 如果您符合资格，资格通常依据政府记录决定。\n" +
        "• 请到 mySALAM 官方网站检查资格。\n" +
        "• 如果符合资格，请按照网站显示的索赔步骤办理。",
      mysalamEligibility:
        "*mySALAM* 适用于符合政府批准资格组别的马来西亚人。\n\n" +
        "• 您可以在 mySALAM 官方网站查询状态。\n" +
        "• 资格通常依据政府记录决定。",
      mysalamCoverage:
        "*mySALAM* 可能提供：\n\n" +
        "• 某些重大疾病的现金援助\n" +
        "• 符合条件住院个案的住院收入援助\n" +
        "• 减轻医疗费用负担的保障",
      socsoApply:
        "关于 *SOCSO / PERKESO*：\n\n" +
        "• 员工通常由雇主代为注册。\n" +
        "• 雇主会为符合资格的员工缴纳供款。\n" +
        "• 如要索赔，可能需要向 PERKESO 提交相关证明文件。",
      socsoEligibility:
        "*SOCSO / PERKESO* 主要保障马来西亚符合资格的雇员。\n\n" +
        "• 保障范围取决于就业身份和供款规定。",
      socsoCoverage:
        "*SOCSO / PERKESO* 可能提供：\n\n" +
        "• 医疗福利\n" +
        "• 工伤保障\n" +
        "• 康复援助\n" +
        "• 视个案而定的其他福利",
      madaniApply:
        "使用 *Skim Perubatan Madani* 的方式：\n\n" +
        "• 先检查自己是否符合资格。\n" +
        "• 前往参与计划的诊所。\n" +
        "• 出示身份证进行核实。\n" +
        "• 诊所会确认本次就诊是否在保障范围内。",
      madaniEligibility:
        "*Skim Perubatan Madani* 的资格取决于该计划批准的受益群体。\n\n" +
        "• 您可以通过官方平台或诊所核实资格。",
      madaniCoverage:
        "*Skim Perubatan Madani* 主要涵盖参与计划的私人诊所中针对*轻微疾病*的治疗，并须遵守相关配套规定。",
      whoChip: "谁符合资格？",
      coverChip: "涵盖什么？",
      applyChip: "如何申请？",
      clinicChip: "找附近诊所",
      claimMySalamChip: "如何索赔mySALAM？"
    },

    ta: {
      pekaApply:
        "*PEKA B40* பயன்படுத்துவது எப்படி:\n\n" +
        "• முதலில் நீங்கள் தகுதியானவரா என்று சரிபார்க்கவும்.\n" +
        "• தகுதி இருந்தால், *பதிவு செய்யப்பட்ட PEKA B40 பேனல் கிளினிக்கிற்கு* செல்லவும்.\n" +
        "• சரிபார்ப்புக்காக *MyKad / அடையாள அட்டை* கொண்டு செல்லவும்.\n" +
        "• கிளினிக் சுகாதார பரிசோதனை மற்றும் அடுத்த படிகளை விளக்கும்.",
      pekaEligibility:
        "*PEKA B40* பொதுவாக *B40 குறைந்த வருமானக் குழுவில்* உள்ள மலேசியர்களுக்கு, குறிப்பாக *40 வயது மற்றும் அதற்கு மேற்பட்டவர்களுக்கு* வழங்கப்படுகிறது.\n\n" +
        "• அதிகாரப்பூர்வ PEKA B40 இணையதளத்தில் தகுதியைச் சரிபார்க்கலாம்.\n" +
        "• பேனல் கிளினிக்குச் செல்லும்போது அடையாள அட்டை கொண்டு செல்லவும்.",
      pekaCoverage:
        "*PEKA B40* வழங்குவது:\n\n" +
        "• இலவச சுகாதார பரிசோதனை\n" +
        "• சில மருத்துவ சாதனங்களுக்கு உதவி\n" +
        "• சில புற்றுநோய் சிகிச்சைக்கான ஊக்கத் தொகை\n" +
        "• சிகிச்சை செல்லும் போக்குவரத்து உதவி",
      tbpApply:
  "*Tabung Bantuan Perubatan (TBP)* குறித்து:\n\n" +
  "• நீங்கள் *அரசு மருத்துவமனை* மூலம் பரிந்துரைக்கப்பட வேண்டும்.\n" +
  "• மருத்துவமனை உங்கள் நிதிநிலையை மதிப்பீடு செய்யும்.\n" +
  "• தேவையான ஆவணங்களை மருத்துவமனை மூலம் சமர்ப்பிக்க வேண்டும்.\n" +
  "• ஒப்புதல் மருத்துவ மற்றும் நிதி தேவையைப் பொறுத்தது.",

tbpEligibility:
  "*Tabung Bantuan Perubatan (TBP)* கீழ்க்கண்ட மலேசியர்களுக்காகும்:\n\n" +
  "• சிகிச்சை செலவை ஏற்க முடியாதவர்கள்\n" +
  "• அரசு மருத்துவமனையில் சிகிச்சை பெறுபவர்கள்\n" +
  "• நிதி மதிப்பீட்டு நிபந்தனைகளை பூர்த்தி செய்பவர்கள்",

tbpCoverage:
  "*TBP* உதவி செய்யக்கூடியவை:\n\n" +
  "• மருத்துவ சிகிச்சை செலவு\n" +
  "• மருத்துவ உபகரணங்கள்\n" +
  "• அரசு மருத்துவமனைகளில் சில குறிப்பிட்ட சிகிச்சை நடைமுறைகள்",
      mysalamApply:
        "*mySALAM* பற்றி:\n\n" +
        "• பொதுவாக *தனியாக பதிவு செய்ய தேவையில்லை*.\n" +
        "• நீங்கள் தகுதியானவராக இருந்தால், அது அரசின் பதிவுகளை அடிப்படையாகக் கொண்டிருக்கும்.\n" +
        "• அதிகாரப்பூர்வ mySALAM இணையதளத்தில் தகுதியைச் சரிபார்க்கவும்.\n" +
        "• தகுதி இருந்தால், அங்குக் காட்டப்படும் கோரிக்கை நடைமுறைகளைப் பின்பற்றவும்.",
      mysalamEligibility:
        "*mySALAM* என்பது அரசால் அங்கீகரிக்கப்பட்ட தகுதி குழுவில் உள்ள மலேசியர்களுக்காகும்.\n\n" +
        "• உங்கள் நிலையை அதிகாரப்பூர்வ mySALAM இணையதளத்தில் சரிபார்க்கலாம்.\n" +
        "• தகுதி பொதுவாக அரசின் பதிவுகளை அடிப்படையாகக் கொண்டது.",
      mysalamCoverage:
        "*mySALAM* வழங்கக்கூடியவை:\n\n" +
        "• சில கடுமையான நோய்களுக்கு நிதி உதவி\n" +
        "• தகுதியான மருத்துவமனை அனுமதிக்கான வருமான ஆதரவு\n" +
        "• மருத்துவச் செலவுச் சுமையை குறைக்கும் பாதுகாப்பு",
      socsoApply:
        "*SOCSO / PERKESO* பற்றி:\n\n" +
        "• ஊழியர்கள் பொதுவாக அவர்களின் முதலாளியால் பதிவு செய்யப்படுவர்.\n" +
        "• தகுதியான ஊழியர்களுக்காக முதலாளி பங்களிப்பு செலுத்துவார்.\n" +
        "• கோரிக்கைக்காக, ஆதார ஆவணங்கள் PERKESO-க்கு சமர்ப்பிக்கப்பட வேண்டியிருக்கும்.",
      socsoEligibility:
        "*SOCSO / PERKESO* முக்கியமாக மலேசியாவில் தகுதியான ஊழியர்களைக் காக்கிறது.\n\n" +
        "• பாதுகாப்பு வேலைநிலை மற்றும் பங்களிப்பு விதிமுறைகளைப் பொறுத்தது.",
      socsoCoverage:
        "*SOCSO / PERKESO* வழங்கக்கூடியவை:\n\n" +
        "• மருத்துவ நலன்கள்\n" +
        "• வேலை விபத்து பாதுகாப்பு\n" +
        "• மீளுருவாக்க உதவி\n" +
        "• வழக்கைப் பொறுத்த பிற நலன்கள்",
      madaniApply:
        "*Skim Perubatan Madani* பயன்படுத்துவது எப்படி:\n\n" +
        "• முதலில் தகுதியைச் சரிபார்க்கவும்.\n" +
        "• பங்கேற்கும் கிளினிக்குச் செல்லவும்.\n" +
        "• சரிபார்ப்புக்காக அடையாள அட்டை காட்டவும்.\n" +
        "• உங்கள் வருகை பாதுகாப்பில் உள்ளதா என்பதை கிளினிக் உறுதி செய்யும்.",
      madaniEligibility:
        "*Skim Perubatan Madani* தகுதி, இந்த திட்டத்தின் கீழ் அங்கீகரிக்கப்பட்ட பயனாளர் குழுவைப் பொறுத்தது.\n\n" +
        "• அதிகாரப்பூர்வ தளம் அல்லது கிளினிக் சரிபார்ப்பு மூலம் பார்க்கலாம்.",
      madaniCoverage:
        "*Skim Perubatan Madani* முக்கியமாக பங்கேற்கும் தனியார் கிளினிக்குகளில் *சிறிய நோய்களுக்கு* சிகிச்சையை வழங்குகிறது; இது திட்ட விதிமுறைகளுக்கு உட்பட்டது.",
      whoChip: "யார் தகுதியானவர்?",
      coverChip: "என்ன உதவி கிடைக்கும்?",
      applyChip: "எப்படி விண்ணப்பிப்பது?",
      clinicChip: "அருகில் கிளினிக்",
      claimMySalamChip: "mySALAM எப்படி?"
    },

    id: {
      pekaApply:
        "Untuk menggunakan *PEKA B40*:\n\n" +
        "• Pertama, periksa apakah kamu memenuhi syarat.\n" +
        "• Jika memenuhi syarat, pergi ke *klinik panel PEKA B40* yang terdaftar.\n" +
        "• Bawa *MyKad / IC* untuk verifikasi.\n" +
        "• Klinik akan membantu proses pemeriksaan dan langkah berikutnya.",
      pekaEligibility:
        "*PEKA B40* umumnya untuk warga Malaysia dalam kelompok *B40*, khususnya yang *berusia 40 tahun ke atas*.\n\n" +
        "• Kamu bisa cek kelayakan di situs resmi PEKA B40.\n" +
        "• Bawa IC saat pergi ke klinik panel.",
      pekaCoverage:
        "*PEKA B40* membantu dengan:\n\n" +
        "• Pemeriksaan kesehatan gratis\n" +
        "• Bantuan untuk beberapa alat kesehatan\n" +
        "• Insentif untuk perawatan kanker tertentu\n" +
        "• Insentif transportasi untuk kunjungan perawatan",
      tbpApply:
  "Untuk *Tabung Bantuan Perubatan (TBP)*:\n\n" +
  "• Kamu harus dirujuk oleh *rumah sakit pemerintah*.\n" +
  "• Pihak rumah sakit akan menilai kondisi keuanganmu.\n" +
  "• Serahkan dokumen yang diperlukan melalui rumah sakit.\n" +
  "• Persetujuan bergantung pada kebutuhan medis dan keuangan.",

tbpEligibility:
  "*Tabung Bantuan Perubatan (TBP)* adalah untuk warga Malaysia yang:\n\n" +
  "• Tidak mampu menanggung biaya pengobatan\n" +
  "• Menerima perawatan di rumah sakit pemerintah\n" +
  "• Memenuhi persyaratan penilaian keuangan",

tbpCoverage:
  "*TBP* dapat membantu menanggung:\n\n" +
  "• Biaya perawatan medis\n" +
  "• Peralatan medis\n" +
  "• Beberapa prosedur tertentu di rumah sakit pemerintah",
      mysalamApply:
        "Untuk *mySALAM*:\n\n" +
        "• Biasanya *tidak perlu daftar secara manual*.\n" +
        "• Jika kamu memenuhi syarat, statusmu didasarkan pada data pemerintah.\n" +
        "• Cek kelayakan di situs resmi mySALAM.\n" +
        "• Jika memenuhi syarat, ikuti langkah klaim yang ditampilkan di sana.",
      mysalamEligibility:
        "*mySALAM* adalah untuk warga Malaysia yang memenuhi syarat dalam kelompok yang disetujui pemerintah.\n\n" +
        "• Cek statusmu di situs resmi mySALAM.\n" +
        "• Kelayakan biasanya berdasarkan data pemerintah.",
      mysalamCoverage:
        "*mySALAM* dapat memberikan:\n\n" +
        "• Bantuan keuangan untuk penyakit kritis tertentu\n" +
        "• Dukungan pendapatan saat rawat inap untuk kasus yang memenuhi syarat\n" +
        "• Perlindungan untuk mengurangi beban biaya medis",
      socsoApply:
        "Untuk *SOCSO / PERKESO*:\n\n" +
        "• Pekerja biasanya didaftarkan oleh pemberi kerja.\n" +
        "• Pemberi kerja membayar kontribusi untuk pekerja yang memenuhi syarat.\n" +
        "• Untuk klaim, dokumen pendukung mungkin perlu diserahkan ke PERKESO.",
      socsoEligibility:
        "*SOCSO / PERKESO* terutama melindungi pekerja yang memenuhi syarat di Malaysia.\n\n" +
        "• Perlindungan bergantung pada status pekerjaan dan aturan kontribusi.",
      socsoCoverage:
        "*SOCSO / PERKESO* dapat memberikan:\n\n" +
        "• Manfaat medis\n" +
        "• Perlindungan cedera kerja\n" +
        "• Dukungan rehabilitasi\n" +
        "• Manfaat lain tergantung kasus",
      madaniApply:
        "Untuk menggunakan *Skim Perubatan Madani*:\n\n" +
        "• Periksa dulu apakah kamu memenuhi syarat.\n" +
        "• Kunjungi klinik yang berpartisipasi.\n" +
        "• Tunjukkan IC untuk verifikasi.\n" +
        "• Klinik akan mengonfirmasi apakah kunjunganmu ditanggung.",
      madaniEligibility:
        "Kelayakan untuk *Skim Perubatan Madani* bergantung pada kelompok penerima manfaat yang disetujui dalam skema ini.\n\n" +
        "• Kamu bisa mengecek melalui portal resmi atau verifikasi klinik.",
      madaniCoverage:
        "*Skim Perubatan Madani* terutama menanggung perawatan untuk *penyakit ringan* di klinik swasta yang berpartisipasi, sesuai aturan paket.",
      whoChip: "Siapa yang berhak?",
      coverChip: "Apa saja manfaatnya?",
      applyChip: "Cara daftar?",
      clinicChip: "Cari klinik terdekat",
      claimMySalamChip: "Cara klaim mySALAM?"
    },

    tl: {
      pekaApply:
        "Para magamit ang *PEKA B40*:\n\n" +
        "• Una, tingnan kung kwalipikado ka.\n" +
        "• Kung kwalipikado, pumunta sa *rehistradong PEKA B40 panel clinic*.\n" +
        "• Dalhin ang iyong *MyKad / IC* para sa beripikasyon.\n" +
        "• Tutulungan ka ng klinika sa screening at susunod na hakbang.",
      pekaEligibility:
        "Ang *PEKA B40* ay karaniwang para sa mga mamamayan ng Malaysia sa *B40 group*, lalo na sa mga *edad 40 pataas*.\n\n" +
        "• Maaari mong suriin ang kwalipikasyon sa opisyal na PEKA B40 website.\n" +
        "• Dalhin ang iyong IC kapag pupunta sa panel clinic.",
      pekaCoverage:
        "Ang *PEKA B40* ay tumutulong sa:\n\n" +
        "• Libreng health screening\n" +
        "• Tulong para sa ilang medical devices\n" +
        "• Insentibo para sa ilang paggamot sa kanser\n" +
        "• Insentibo sa transportasyon para sa pagpapagamot",
      tbpApply:
  "Para sa *Tabung Bantuan Perubatan (TBP)*:\n\n" +
  "• Kailangan kang i-refer ng *pampublikong ospital*.\n" +
  "• Susuriin ng ospital ang iyong kalagayang pinansyal.\n" +
  "• Isumite ang mga kailangang dokumento sa pamamagitan ng ospital.\n" +
  "• Ang pag-apruba ay depende sa medikal at pinansyal na pangangailangan.",

tbpEligibility:
  "Ang *Tabung Bantuan Perubatan (TBP)* ay para sa mga Malaysian na:\n\n" +
  "• Hindi kayang bayaran ang gastos sa paggamot\n" +
  "• Tumatanggap ng paggamot sa pampublikong ospital\n" +
  "• Pumapasa sa financial assessment requirements",

tbpCoverage:
  "Maaaring tumulong ang *TBP* sa pagbayad ng:\n\n" +
  "• Gastos sa medikal na paggamot\n" +
  "• Kagamitang medikal\n" +
  "• Ilang partikular na procedure sa pampublikong ospital",
      mysalamApply:
        "Para sa *mySALAM*:\n\n" +
        "• Karaniwan ay *hindi kailangang mag-manual register*.\n" +
        "• Kung kwalipikado ka, ang status mo ay batay sa rekord ng gobyerno.\n" +
        "• Suriin ang iyong kwalipikasyon sa opisyal na mySALAM website.\n" +
        "• Kung kwalipikado, sundin ang mga hakbang sa claim na nakalagay roon.",
      mysalamEligibility:
        "Ang *mySALAM* ay para sa mga kwalipikadong Malaysian sa aprubadong grupo ng gobyerno.\n\n" +
        "• Suriin ang status mo sa opisyal na mySALAM website.\n" +
        "• Karaniwang batay sa rekord ng gobyerno ang kwalipikasyon.",
      mysalamCoverage:
        "Maaaring magbigay ang *mySALAM* ng:\n\n" +
        "• Tulong pinansyal para sa ilang kritikal na sakit\n" +
        "• Suporta sa kita habang naka-ospital para sa mga kwalipikadong kaso\n" +
        "• Proteksyong makababawas sa bigat ng gastusing medikal",
      socsoApply:
        "Para sa *SOCSO / PERKESO*:\n\n" +
        "• Karaniwang ang employer ang nagrerehistro sa empleyado.\n" +
        "• Nagbabayad ang employer ng kontribusyon para sa mga kwalipikadong manggagawa.\n" +
        "• Para sa claim, maaaring kailangang magsumite ng supporting documents sa PERKESO.",
      socsoEligibility:
        "Ang *SOCSO / PERKESO* ay pangunahing sumasaklaw sa mga kwalipikadong empleyado sa Malaysia.\n\n" +
        "• Nakadepende ang coverage sa employment status at contribution rules.",
      socsoCoverage:
        "Maaaring magbigay ang *SOCSO / PERKESO* ng:\n\n" +
        "• Medical benefits\n" +
        "• Proteksyon sa aksidente sa trabaho\n" +
        "• Suporta sa rehabilitasyon\n" +
        "• Iba pang benepisyo depende sa kaso",
      madaniApply:
        "Para magamit ang *Skim Perubatan Madani*:\n\n" +
        "• Suriin muna kung kwalipikado ka.\n" +
        "• Pumunta sa kasaling klinika.\n" +
        "• Ipakita ang iyong IC para sa beripikasyon.\n" +
        "• Kukumpirmahin ng klinika kung saklaw ang iyong pagbisita.",
      madaniEligibility:
        "Ang kwalipikasyon para sa *Skim Perubatan Madani* ay nakadepende sa aprubadong beneficiary group ng scheme.\n\n" +
        "• Maaari itong suriin sa opisyal na portal o sa beripikasyon ng klinika.",
      madaniCoverage:
        "Ang *Skim Perubatan Madani* ay pangunahing sumasaklaw sa paggamot para sa *mga minor illness* sa mga kasaling pribadong klinika, ayon sa mga tuntunin ng package.",
      whoChip: "Sino ang kwalipikado?",
      coverChip: "Ano ang benepisyo?",
      applyChip: "Paano mag-apply?",
      clinicChip: "Maghanap ng klinika",
      claimMySalamChip: "Paano mag-claim mySALAM?"
    },

    vi: {
      pekaApply:
        "Để sử dụng *PEKA B40*:\n\n" +
        "• Trước tiên, hãy kiểm tra xem bạn có đủ điều kiện hay không.\n" +
        "• Nếu đủ điều kiện, hãy đến *phòng khám đối tác PEKA B40* đã đăng ký.\n" +
        "• Mang theo *MyKad / IC* để xác minh.\n" +
        "• Phòng khám sẽ hướng dẫn bạn kiểm tra sức khỏe và các bước tiếp theo.",
      pekaEligibility:
        "*PEKA B40* thường dành cho công dân Malaysia thuộc nhóm *B40*, đặc biệt là những người *từ 40 tuổi trở lên*.\n\n" +
        "• Bạn có thể kiểm tra điều kiện trên trang web chính thức của PEKA B40.\n" +
        "• Hãy mang IC khi đến phòng khám đối tác.",
      pekaCoverage:
        "*PEKA B40* hỗ trợ:\n\n" +
        "• Khám sức khỏe miễn phí\n" +
        "• Hỗ trợ một số thiết bị y tế\n" +
        "• Hỗ trợ cho một số điều trị ung thư\n" +
        "• Hỗ trợ chi phí đi lại để điều trị",
        tbpApply:
  "Đối với *Tabung Bantuan Perubatan (TBP)*:\n\n" +
  "• Bạn cần được *bệnh viện chính phủ* giới thiệu.\n" +
  "• Bệnh viện sẽ đánh giá tình hình tài chính của bạn.\n" +
  "• Nộp các giấy tờ cần thiết thông qua bệnh viện.\n" +
  "• Việc phê duyệt phụ thuộc vào nhu cầu y tế và tài chính.",

tbpEligibility:
  "*Tabung Bantuan Perubatan (TBP)* dành cho người Malaysia:\n\n" +
  "• Không đủ khả năng chi trả chi phí điều trị\n" +
  "• Được điều trị tại bệnh viện chính phủ\n" +
  "• Đáp ứng yêu cầu đánh giá tài chính",

tbpCoverage:
  "*TBP* có thể hỗ trợ chi trả:\n\n" +
  "• Chi phí điều trị y tế\n" +
  "• Thiết bị y tế\n" +
  "• Một số thủ thuật nhất định tại bệnh viện chính phủ",
      mysalamApply:
        "Đối với *mySALAM*:\n\n" +
        "• Thông thường *không cần đăng ký thủ công*.\n" +
        "• Nếu bạn đủ điều kiện, trạng thái sẽ dựa trên dữ liệu của chính phủ.\n" +
        "• Hãy kiểm tra điều kiện trên trang web chính thức của mySALAM.\n" +
        "• Nếu đủ điều kiện, hãy làm theo các bước yêu cầu quyền lợi được hiển thị ở đó.",
      mysalamEligibility:
        "*mySALAM* dành cho người Malaysia đủ điều kiện trong nhóm được chính phủ phê duyệt.\n\n" +
        "• Kiểm tra trạng thái của bạn trên trang web chính thức của mySALAM.\n" +
        "• Điều kiện thường dựa trên dữ liệu của chính phủ.",
      mysalamCoverage:
        "*mySALAM* có thể cung cấp:\n\n" +
        "• Hỗ trợ tài chính cho một số bệnh hiểm nghèo\n" +
        "• Hỗ trợ thu nhập khi nhập viện cho các trường hợp đủ điều kiện\n" +
        "• Bảo vệ để giảm gánh nặng chi phí y tế",
      socsoApply:
        "Đối với *SOCSO / PERKESO*:\n\n" +
        "• Nhân viên thường được đăng ký bởi người sử dụng lao động.\n" +
        "• Người sử dụng lao động đóng góp cho những lao động đủ điều kiện.\n" +
        "• Khi yêu cầu quyền lợi, có thể cần nộp tài liệu hỗ trợ cho PERKESO.",
      socsoEligibility:
        "*SOCSO / PERKESO* chủ yếu bảo vệ những người lao động đủ điều kiện tại Malaysia.\n\n" +
        "• Phạm vi bảo vệ phụ thuộc vào tình trạng việc làm và quy định đóng góp.",
      socsoCoverage:
        "*SOCSO / PERKESO* có thể cung cấp:\n\n" +
        "• Quyền lợi y tế\n" +
        "• Bảo vệ tai nạn lao động\n" +
        "• Hỗ trợ phục hồi chức năng\n" +
        "• Các quyền lợi khác tùy từng trường hợp",
      madaniApply:
        "Để sử dụng *Skim Perubatan Madani*:\n\n" +
        "• Trước tiên hãy kiểm tra xem bạn có đủ điều kiện hay không.\n" +
        "• Đến phòng khám tham gia chương trình.\n" +
        "• Xuất trình IC để xác minh.\n" +
        "• Phòng khám sẽ xác nhận chuyến khám của bạn có được chi trả hay không.",
      madaniEligibility:
        "Điều kiện của *Skim Perubatan Madani* phụ thuộc vào nhóm người thụ hưởng được phê duyệt trong chương trình.\n\n" +
        "• Bạn có thể kiểm tra qua cổng thông tin chính thức hoặc xác minh tại phòng khám.",
      madaniCoverage:
        "*Skim Perubatan Madani* chủ yếu chi trả điều trị cho *bệnh nhẹ* tại các phòng khám tư tham gia chương trình, tùy theo quy định gói dịch vụ.",
      whoChip: "Ai đủ điều kiện?",
      coverChip: "Có quyền lợi gì?",
      applyChip: "Cách đăng ký",
      clinicChip: "Tìm phòng khám gần đây",
      claimMySalamChip: "Cách nhận mySALAM?"
    }
  };

  return data[L] || data.en;
}

function topicChips(type) {
  const x = localTopicText();

  if (type === "peka") {
    return [x.whoChip, x.coverChip, x.clinicChip];
  }
  if (type === "pekaApply") {
    return [x.whoChip, x.coverChip, x.clinicChip];
  }
  if (type === "mysalam") {
    return [x.whoChip, x.coverChip, x.claimMySalamChip];
  }
  if (type === "socso") {
    return [x.whoChip, x.coverChip];
  }
  if (type === "madani") {
    return [x.whoChip, x.coverChip, x.clinicChip];
  }
  if (type === "tbp") {
  return [x.whoChip, x.coverChip, x.applyChip];
}

  return [x.whoChip, x.coverChip, x.applyChip];
}

function getLocalTopicReply(userText) {
  const text = normalizeText(userText);
  const L = localTopicText();

  updateTopicFromText(userText);

  if (currentTopic === "peka_b40") {
    if (isApplyQuestion(text)) {
      return {
        reply: L.pekaApply,
        source_name: "PEKA B40 Official",
        source_url: "https://pekab40.com.my",
        follow_up_chips: topicChips("pekaApply"),
        out_of_scope: false
      };
    }

    if (isEligibilityQuestion(text)) {
      return {
        reply: L.pekaEligibility,
        source_name: "PEKA B40 Official",
        source_url: "https://pekab40.com.my",
        follow_up_chips: [L.coverChip, L.applyChip, L.clinicChip],
        out_of_scope: false
      };
    }

    if (isCoverageQuestion(text)) {
      return {
        reply: L.pekaCoverage,
        source_name: "PEKA B40 Official",
        source_url: "https://pekab40.com.my",
        follow_up_chips: [L.whoChip, L.applyChip, L.clinicChip],
        out_of_scope: false
      };
    }

    if (isClinicFollowupQuestion(text)) {
      showClinicMap();
      return { handled: true };
    }
  }

  if (currentTopic === "mysalam") {
    if (isApplyQuestion(text)) {
      return {
        reply: L.mysalamApply,
        source_name: "mySALAM Official",
        source_url: "https://www.mysalam.com.my",
        follow_up_chips: topicChips("mysalam"),
        out_of_scope: false
      };
    }

    if (isEligibilityQuestion(text)) {
      return {
        reply: L.mysalamEligibility,
        source_name: "mySALAM Official",
        source_url: "https://www.mysalam.com.my",
        follow_up_chips: [L.coverChip, L.applyChip, L.claimMySalamChip],
        out_of_scope: false
      };
    }

    if (isCoverageQuestion(text)) {
      return {
        reply: L.mysalamCoverage,
        source_name: "mySALAM Official",
        source_url: "https://www.mysalam.com.my",
        follow_up_chips: [L.whoChip, L.applyChip, L.claimMySalamChip],
        out_of_scope: false
      };
    }
  }

  if (currentTopic === "socso") {
    if (isApplyQuestion(text)) {
      return {
        reply: L.socsoApply,
        source_name: "PERKESO Official",
        source_url: "https://www.perkeso.gov.my",
        follow_up_chips: topicChips("socso"),
        out_of_scope: false
      };
    }

    if (isEligibilityQuestion(text)) {
      return {
        reply: L.socsoEligibility,
        source_name: "PERKESO Official",
        source_url: "https://www.perkeso.gov.my",
        follow_up_chips: [L.coverChip, L.applyChip],
        out_of_scope: false
      };
    }

    if (isCoverageQuestion(text)) {
      return {
        reply: L.socsoCoverage,
        source_name: "PERKESO Official",
        source_url: "https://www.perkeso.gov.my",
        follow_up_chips: [L.whoChip, L.applyChip],
        out_of_scope: false
      };
    }
  }

  if (currentTopic === "madani") {
    if (isApplyQuestion(text)) {
      return {
        reply: L.madaniApply,
        source_name: "Skim Perubatan Madani",
        source_url: "https://www.protecthealth.com.my/skimperubatanmadani/",
        follow_up_chips: topicChips("madani"),
        out_of_scope: false
      };
    }

    if (isEligibilityQuestion(text)) {
      return {
        reply: L.madaniEligibility,
        source_name: "Skim Perubatan Madani",
        source_url: "https://www.protecthealth.com.my/skimperubatanmadani/",
        follow_up_chips: [L.coverChip, L.applyChip, L.clinicChip],
        out_of_scope: false
      };
    }

    if (isCoverageQuestion(text)) {
      return {
        reply: L.madaniCoverage,
        source_name: "Skim Perubatan Madani",
        source_url: "https://www.protecthealth.com.my/skimperubatanmadani/",
        follow_up_chips: [L.whoChip, L.applyChip, L.clinicChip],
        out_of_scope: false
      };
    }

    if (isClinicFollowupQuestion(text)) {
      showClinicMap();
      return { handled: true };
    }
  }

  if (currentTopic === "tbp") {
  if (isApplyQuestion(text)) {
    return {
      reply: L.tbpApply,
      source_name: "MOH Malaysia",
      source_url: "https://www.moh.gov.my",
      follow_up_chips: topicChips("tbp"),
      out_of_scope: false
    };
  }

  if (isEligibilityQuestion(text)) {
    return {
      reply: L.tbpEligibility,
      source_name: "MOH Malaysia",
      source_url: "https://www.moh.gov.my",
      follow_up_chips: [L.coverChip, L.applyChip],
      out_of_scope: false
    };
  }

  if (isCoverageQuestion(text)) {
    return {
      reply: L.tbpCoverage,
      source_name: "MOH Malaysia",
      source_url: "https://www.moh.gov.my",
      follow_up_chips: [L.whoChip, L.applyChip],
      out_of_scope: false
    };
  }
}
  return null;
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
    currentTopic = "general";
    addBotMessage(data.reply || t().welcomeFallback, null, null, data.follow_up_chips || [], false);
  } catch {
    currentTopic = "general";
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

  updateTopicFromText(userText);

  isLoading = true;
  sendBtn.disabled = true;
  statusText.textContent = t().statusTyping;

  addUserMessage(userText);
  addTypingIndicator();

  try {
    const localReply = getLocalTopicReply(userText);

    if (localReply) {
      removeTypingIndicator();

      if (localReply.handled) {
        isLoading = false;
        sendBtn.disabled = false;
        statusText.textContent = t().statusReady;
        inputEl.focus();
        return;
      }

      addBotMessage(
        localReply.reply,
        localReply.source_name || null,
        localReply.source_url || null,
        localReply.follow_up_chips || [],
        localReply.out_of_scope || false
      );

      isLoading = false;
      sendBtn.disabled = false;
      statusText.textContent = t().statusReady;
      inputEl.focus();
      return;
    }

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
      zh: ["介绍PEKA B40", "如何索赔mySALAM？", "找附近诊所"],
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
  en: "Please summarize this policy into exactly 4 simple bullet points in English. You MUST include: (1) what the scheme is, (2) who is eligible, (3) what benefits they get, and (4) how to apply or claim. Start each bullet with •",
  bm: "Sila ringkaskan polisi ini kepada tepat 4 poin mudah dalam Bahasa Malaysia. Anda MESTI masukkan: (1) apa skim ini, (2) siapa layak, (3) faedah yang diberi, dan (4) cara mohon atau tuntut. Mulakan setiap poin dengan •",
  zh: "请用简体中文把此政策总结成刚好4个简单要点。必须包括这4项：(1) 这是什么计划，(2) 谁符合资格，(3) 有什么福利，(4) 如何申请。每点以•开始",
  ta: "இந்த கொள்கையை சரியாக 4 எளிய குறிப்புகளாக சுருக்கவும். இந்த 4 விஷயங்கள் கட்டாயம் இருக்க வேண்டும்: (1) இது என்ன திட்டம், (2) யார் தகுதி, (3) என்ன நன்மை, (4) எப்படி விண்ணப்பிப்பது. ஒவ்வொரு குறிப்பும் • என்று தொடங்க வேண்டும்",
  id: "Ringkas kebijakan ini menjadi tepat 4 poin sederhana dalam Bahasa Indonesia. WAJIB masukkan 4 hal ini: (1) apa skemanya, (2) siapa yang berhak, (3) manfaatnya, dan (4) cara daftar. Mulai setiap poin dengan •",
  tl: "Ibuod ang patakarang ito sa eksaktong 4 na simpleng puntos sa Filipino. DAPAT kasama ang: (1) ano ang programa, (2) sino ang kwalipikado, (3) ano ang benepisyo, at (4) paano mag-apply. Simulan ang bawat punto sa •",
  vi: "Tóm tắt chính sách này thành đúng 4 ý đơn giản bằng tiếng Việt. BẮT BUỘC có 4 phần: (1) đây là chương trình gì, (2) ai đủ điều kiện, (3) quyền lợi là gì, và (4) cách đăng ký. Bắt đầu mỗi ý bằng •"
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

function detectSchemeFromKeyOrLabel(schemeKey, schemeLabel = "") {
  const text = `${schemeKey || ""} ${schemeLabel || ""}`.toLowerCase();

  if (text.includes("peka")) return "peka_b40";
  if (text.includes("mysalam") || text.includes("my salam")) return "mysalam";
  if (text.includes("socso") || text.includes("perkeso")) return "socso";
  if (text.includes("madani")) return "madani";
  if (text.includes("tbp") || text.includes("tabung bantuan perubatan")) return "tbp";

  return null;
}

function hasStrongApplyInfo(reply) {
  const lower = String(reply || "").toLowerCase();

  return (
    (lower.includes("how to apply") &&
      (lower.includes("visit") || lower.includes("bring") || lower.includes("check eligibility"))) ||

    (lower.includes("how to claim") &&
      (lower.includes("follow") || lower.includes("documents") || lower.includes("eligibility"))) ||

    (lower.includes("cara mohon") &&
      (lower.includes("pergi") || lower.includes("bawa") || lower.includes("semak"))) ||

    (lower.includes("cara tuntut") &&
      (lower.includes("ikut") || lower.includes("dokumen") || lower.includes("semak"))) ||

    (lower.includes("cara daftar") &&
      (lower.includes("semak") || lower.includes("pergi")))
  );
}

function removeWeakApplyLine(reply) {
  return String(reply || "")
    .replace(/^\s*•\s*How to apply:.*$/gim, "")
    .replace(/^\s*•\s*How to claim:.*$/gim, "")
    .replace(/^\s*•\s*Cara mohon:.*$/gim, "")
    .replace(/^\s*•\s*Cara tuntut:.*$/gim, "")
    .replace(/^\s*•\s*Cara daftar:.*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ensureSummarizeHasApply(reply, schemeKey, schemeLabel, lang) {
  const scheme = detectSchemeFromKeyOrLabel(schemeKey, schemeLabel);
  const applyBlock = getApplyBlockByScheme(scheme, lang);

  if (!applyBlock) return reply;

  if (hasStrongApplyInfo(reply)) return reply;

  const cleanedReply = removeWeakApplyLine(reply);
  return `${cleanedReply}\n\n${applyBlock}`;
}

function getApplyBlockByScheme(scheme, lang) {
  const blocks = {
    peka_b40: {
      en:
        "*How to apply:*\n\n" +
        "• First, check if you are eligible.\n" +
        "• If eligible, visit a *registered PEKA B40 panel clinic*.\n" +
        "• Bring your *MyKad / IC* for verification.\n" +
        "• The clinic will guide you for screening and next steps.",
      bm:
        "*Cara mohon:*\n\n" +
        "• Mula-mula, semak sama ada anda layak.\n" +
        "• Jika layak, pergi ke *klinik panel PEKA B40* yang berdaftar.\n" +
        "• Bawa *MyKad / IC* untuk pengesahan.\n" +
        "• Klinik akan bantu anda untuk saringan dan langkah seterusnya."
    },

    mysalam: {
      en:
        "*How to apply / claim:*\n\n" +
        "• Usually, there is *no manual registration*.\n" +
        "• Check your eligibility on the *official mySALAM website*.\n" +
        "• If eligible, follow the claim steps shown there.\n" +
        "• Prepare the required supporting documents if needed.",
      bm:
        "*Cara mohon / tuntut:*\n\n" +
        "• Biasanya *tidak perlu daftar secara manual*.\n" +
        "• Semak kelayakan di *laman rasmi mySALAM*.\n" +
        "• Jika layak, ikut langkah tuntutan yang ditunjukkan di sana.\n" +
        "• Sediakan dokumen sokongan jika diperlukan."
    },

    socso: {
      en:
        "*How to apply / claim:*\n\n" +
        "• Employees are usually *registered by their employer*.\n" +
        "• Employers make contributions for eligible workers.\n" +
        "• For claims, submit the required supporting documents to *PERKESO*.\n" +
        "• Check with your employer or PERKESO for the next steps.",
      bm:
        "*Cara mohon / tuntut:*\n\n" +
        "• Pekerja biasanya *didaftarkan oleh majikan*.\n" +
        "• Majikan membuat caruman untuk pekerja yang layak.\n" +
        "• Untuk tuntutan, hantar dokumen sokongan yang diperlukan kepada *PERKESO*.\n" +
        "• Semak dengan majikan atau PERKESO untuk langkah seterusnya."
    },

    madani: {
      en:
        "*How to apply:*\n\n" +
        "• Check whether you are eligible.\n" +
        "• Visit a *participating clinic*.\n" +
        "• Show your *IC* for verification.\n" +
        "• The clinic will confirm whether your visit is covered.",
      bm:
        "*Cara mohon:*\n\n" +
        "• Semak sama ada anda layak.\n" +
        "• Pergi ke *klinik yang mengambil bahagian*.\n" +
        "• Tunjukkan *IC* untuk pengesahan.\n" +
        "• Klinik akan sahkan sama ada lawatan anda dilindungi."
    },

    tbp: {
      en:
        "*How to apply:*\n\n" +
        "• You must be *referred by a government hospital*.\n" +
        "• The hospital will assess your financial situation.\n" +
        "• Submit the required documents through the hospital.\n" +
        "• Approval depends on medical and financial need.",
      bm:
        "*Cara mohon:*\n\n" +
        "• Anda perlu *dirujuk oleh hospital kerajaan*.\n" +
        "• Pihak hospital akan menilai keadaan kewangan anda.\n" +
        "• Hantar dokumen yang diperlukan melalui hospital.\n" +
        "• Kelulusan bergantung pada keperluan perubatan dan kewangan."
    }
  };

  const chosenLang = (lang === "bm") ? "bm" : "en";
  return blocks[scheme]?.[chosenLang] || "";
}

function removeWeakApplyLine(reply) {
  return String(reply || "")
    // remove headings
    .replace(/^\s*Let me explain.*?:\s*$/gim, "")

    // remove weak apply lines
    .replace(/^\s*•?\s*How to apply:.*$/gim, "")
    .replace(/^\s*•?\s*How to claim:.*$/gim, "")
    .replace(/^\s*•?\s*Cara mohon:.*$/gim, "")
    .replace(/^\s*•?\s*Cara tuntut:.*$/gim, "")

    // 🔥 REMOVE WEBSITE LINES (THIS IS YOUR PROBLEM)
    .replace(/^\s*For more details.*$/gim, "")
    .replace(/^\s*For more information.*$/gim, "")
    .replace(/^\s*Visit .*$/gim, "")
    .replace(/^\s*Please visit .*$/gim, "")
    .replace(/https?:\/\/\S+/gim, "") // removes raw links

    // cleanup spacing
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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
      let reply = data.reply || "Could not summarize. Try again.";
      reply = ensureSummarizeHasApply(reply, schemeKey, schemeLabel, currentLang);

      addBotMessage(
        reply,
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
  window.toggleVoice = toggleVoice;
  window.handleKey = handleKey;
});