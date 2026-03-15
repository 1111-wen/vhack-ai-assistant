LANGUAGE_INSTRUCTIONS = {
    "en": "Always respond in clear, simple ENGLISH.",
    "bm": "Sila jawab dalam BAHASA MALAYSIA yang mudah dan jelas sepenuhnya.",
    "zh": "请始终用简体中文回答，语言要简单清晰。",
    "ta": "எப்போதும் எளிய, தெளிவான தமிழில் பதிலளிக்கவும்.",
}

WELCOME_MESSAGES = {
    "en": (
        "👋 *Selamat Datang!* I'm your Malaysian Healthcare Guide.\n\n"
        "I can help you understand:\n"
        "• 🔍 PEKA B40 — free health screening\n"
        "• 💊 mySALAM — critical illness cash aid\n"
        "• 🏥 Tabung Bantuan Perubatan (TBP)\n"
        "• 🩺 Skim Perubatan Madani — free clinic\n"
        "• 🦺 SOCSO — work accident protection\n\n"
        "Tap a button below or type your question!"
    ),
    "bm": (
        "👋 *Selamat Datang!* Saya Pemandu Penjagaan Kesihatan Malaysia anda.\n\n"
        "Saya boleh membantu anda memahami:\n"
        "• 🔍 PEKA B40 — saringan kesihatan percuma\n"
        "• 💊 mySALAM — bantuan tunai penyakit kritikal\n"
        "• 🏥 Tabung Bantuan Perubatan (TBP)\n"
        "• 🩺 Skim Perubatan Madani — klinik percuma\n"
        "• 🦺 SOCSO — perlindungan kemalangan kerja\n\n"
        "Tekan butang di bawah atau taip soalan anda!"
    ),
    "zh": (
        "👋 *欢迎！* 我是您的马来西亚医疗保健指南。\n\n"
        "我可以帮助您了解：\n"
        "• 🔍 PEKA B40 — 免费健康检查\n"
        "• 💊 mySALAM — 重大疾病现金援助\n"
        "• 🏥 医疗援助基金 (TBP)\n"
        "• 🩺 Skim Perubatan Madani — 免费诊所\n"
        "• 🦺 SOCSO — 工伤保护\n\n"
        "点击下方按钮或输入您的问题！"
    ),
    "ta": (
        "👋 *வரவேற்கிறோம்!* நான் உங்கள் மலேசியா சுகாதார வழிகாட்டி.\n\n"
        "நான் இவற்றில் உதவலாம்:\n"
        "• 🔍 PEKA B40 — இலவச உடல்நல பரிசோதனை\n"
        "• 💊 mySALAM — நோய் பண உதவி\n"
        "• 🏥 மருத்துவ உதவி நிதி (TBP)\n"
        "• 🩺 Skim Perubatan Madani — இலவச கிளினிக்\n"
        "• 🦺 SOCSO — தொழில் விபத்து பாதுகாப்பு\n\n"
        "கீழே உள்ள பொத்தானை அழுத்தவும் அல்லது கேள்வி தட்டச்சு செய்யவும்!"
    ),
}


def get_language_instruction(lang_code: str) -> str:
    return LANGUAGE_INSTRUCTIONS.get(lang_code, LANGUAGE_INSTRUCTIONS["en"])


def get_welcome_message(lang_code: str) -> str:
    return WELCOME_MESSAGES.get(lang_code, WELCOME_MESSAGES["en"])
