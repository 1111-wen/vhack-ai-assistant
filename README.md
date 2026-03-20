**Track:** Inclusive Citizen – Multilingual AI for Public Service

CareBridge is a multilingual AI-powered assistant that simplifies Malaysian government healthcare schemes and helps users understand **eligibility, benefits, and application steps** in a clear and accessible way.
It is designed for users who face barriers such as complex policy language, scattered information, low digital literacy, and limited multilingual support.

---

## 🎯 Problem Statement
Many Malaysians struggle to access and understand government healthcare support such as **PEKA B40, mySALAM, SOCSO/PERKESO, Skim Perubatan Madani,** and **Tabung Bantuan Perubatan**.

This happens because:
- Government information is scattered across multiple websites and portals
- Eligibility rules and application steps are difficult to understand
- Elderly users and low digital literacy users find official portals hard to use
- Rural communities and migrant workers may face language and awareness barriers
- Many users do not know which scheme they are eligible for or how to apply

This causes:
- ❌ Missed financial and healthcare assistance
- ❌ Confusion about eligibility and benefits
- ❌ Delayed access to treatment or support
- ❌ Increased burden on hotlines and hospitals for basic inquiries

---

## 💡 Solution
CareBridge transforms complex healthcare policies into **simple, step-by-step guidance** through a familiar chat-based interface.

It helps users:
- Understand what each healthcare scheme is
- Check whether they may be eligible
- Learn what benefits are available
- Get clear guidance on how to apply or claim
- Find nearby clinics quickly

---

## 🚀 Core Features
### 1. Multilingual AI Chatbot
- Supports 7 languages:
  - English
  - Bahasa Melayu
  - Chinese
  - Tamil
  - Indonesian
  - Filipino
  - Vietnamese
- Simplifies complex healthcare policy information into easy language
- Provides localized support for Malaysian public healthcare schemes

### 2. WhatsApp-Style Chat Interface
- Familiar chat layout for better usability
- Designed for low digital literacy users
- Clean UI with guided interactions

### 3. Eligibility Quiz
- Users answer 4 simple questions
- System provides scheme recommendations based on user input
- Works as a **pre-screening tool** for healthcare support

### 4. Policy Summarizer
- Summarizes healthcare policies into short bullet points
- Explains:
  - What the scheme is
  - Who is eligible
  - What benefits are provided
  - How to apply or claim

### 5. Voice Input
- Supports microphone-based interaction
- Improves accessibility for users who prefer speaking instead of typing

### 6. Clinic Finder
- Helps users find nearby clinics quickly
- Includes:
  - Klinik Kesihatan
  - PEKA B40 panel clinics
  - Skim Perubatan Madani clinics
- Uses Google Maps search links for easy access

### 7. Scheme-Specific Guidance
Currently supports:
- **PEKA B40**
- **mySALAM**
- **SOCSO / PERKESO**
- **Skim Perubatan Madani**
- **Tabung Bantuan Perubatan (TBP)**

### 8. Real-Time Information Retrieval
- Retrieves relevant healthcare scheme information from official sources
- Helps users get more reliable and updated responses

---

## 🌟 Extra Value

- Inclusive support for elderly users, rural communities, and migrant workers
- Reduces confusion caused by fragmented government information
- Encourages early awareness of available healthcare support
- Can reduce manual inquiry workload for hospitals, NGOs, and agencies

---

## 🔮 Future Improvements

- Integration with government APIs
- Real-time eligibility verification using official data
- Mobile app deployment
- Offline / low-internet support
- More accurate AI personalization
- Context-aware conversation memory
- Expansion into other public service sectors:
  - Housing assistance
  - Welfare support
  - Financial aid programs
  - Education assistance

---

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend & RAG Engine
- FastAPI
- Python
- Jinja

### APIs / Services
- SEA-LION AI
- Web Speech API
- Google Maps
- Real-time retrieval from official healthcare information sources

---

## 👥 Target Users
CareBridge is designed for:
- B40 and M40 Malaysians
- Elderly users
- Rural communities
- Low digital literacy users
- Non-English speakers
- First-time healthcare scheme users
- Migrant workers with limited access to information

---
## 💼 Business Model
### Free Public Access
- Free chatbot access for healthcare scheme information
- Eligibility checking and policy explanation
- Multilingual support for inclusive accessibility

### Institution-Based Revenue
Potential adoption by:
- Government agencies
- NGOs
- Clinics and healthcare partners
Use cases include:
- Public health awareness
- Pre-screening before application
- Reducing hospital and hotline workload

### Future Expansion
- Personalized recommendations
- Integration with official systems
- Broader public assistance coverage beyond healthcare

---

## 📊 Competitor Analysis
| Competitor           | Limitation                            |
|----------------------|---------------------------------------|
| Government websites  | Complex and hard to navigate          |
| Google search        | Too much unstructured information     |
| Generic chatbots     | Not localized to Malaysian healthcare |

### CareBridge Advantages
- Malaysia-specific
- Simple language
- Simple UI
- Step-by-step guidance
- Eligibility checking
- Multilingual support

---

## 📁 Project Structure

📁 Project Structure
carebridge/
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── chat.js
│   └── assets/
│       └── icons/
├── templates/
│   ├── index.html
│   └── base.html
├── app/
│   ├── main.py
│   ├── routes/
│   │   ├── chat.py
│   │   └── welcome.py
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── rag_service.py
│   │   ├── translation_service.py
│   │   └── clinic_service.py
│   ├── utils/
│   │   ├── language_utils.py
│   │   ├── scheme_utils.py
│   │   └── formatting_utils.py
│   └── models/
│       └── schemas.py
├── requirements.txt
├── README.md
└── .env
⚙️ Getting Started
Prerequisites

Python 3.10+

pip

OpenAI API key

Installation

1. Clone the repository

git clone https://github.com/your-username/carebridge.git
cd carebridge

2. Create virtual environment

python -m venv venv

3. Activate virtual environment

Windows

venv\Scripts\activate

Mac/Linux

source venv/bin/activate

4. Install dependencies

pip install -r requirements.txt

5. Create environment variables

Create .env file:

OPENAI_API_KEY=your_api_key_here

6. Run the application

uvicorn app.main:app --reload

7. Open in browser

http://127.0.0.1:8000

---

##📋 Example User Flows
Example 1: Eligibility Guidance
User asks:
Am I eligible for PEKA B40?
System response:
Explains who PEKA B40 is for
Gives simple eligibility guidance
Suggests follow-up actions

Example 2: Policy Summary
User selects:
Summarize PEKA B40
System response:
Explains what the scheme is
Who can get it
What benefits it covers
How to apply

Example 3: Clinic Search
User asks:
Find clinic near me
System response:
Shows clinic search options
Links to Google Maps for nearby clinics

Example 4: Voice Interaction
User clicks microphone and speaks
System response:
Converts voice to text
Processes healthcare question
Returns multilingual guidance

---

##🎯 Project Impact
CareBridge can improve public healthcare access in Malaysia by:
Simplifying complicated healthcare policies
Making government support easier to understand
Helping users identify relevant schemes faster
Increasing awareness among underserved communities
Reducing confusion and misinformation
Supporting inclusive access through multilingual and voice-based interaction

---

##✅ Key Highlights
Multilingual public service assistant
Healthcare-scheme focused
Built for accessibility and inclusion
Combines AI guidance with structured local logic
Practical and scalable for real-world public use

---

##🤝 Contributing
Fork the repository
Create a new branch
Make your changes
Commit your updates
Submit a pull request

---

##📄 References
Official PEKA B40 website
Official mySALAM website
Official PERKESO website
Official Skim Perubatan Madani website
Official Ministry of Health Malaysia resources
Replace with your actual links if needed.

🆘 Support
If you have questions or suggestions, please open an issue in the repository.
Built with ❤️ to make Malaysian public healthcare support more accessible and inclusive.
