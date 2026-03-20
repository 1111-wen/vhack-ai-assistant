# CareBridge
**Case Study 4:** Inclusive Citizen – Multilingual AI for Public Service  

CareBridge is a multilingual AI-powered assistant that simplifies Malaysian government healthcare schemes and helps users understand **eligibility, benefits, and application steps** in a clear and accessible way.

It is designed for users who face barriers such as complex policy language, scattered information, low digital literacy, and limited multilingual support.

---
## 🎥 Demo & Presentation

- 📹 Demo Video: https://video-link
- 📊 Presentation Slides: [https://canva-link](https://www.canva.com/design/DAHETYoEWlE/yZ4FWzDAIGAHRyTqpt-UnQ/edit?utm_content=DAHETYoEWlE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---

## 🎯 Problem Statement

Many Malaysians struggle to access and understand government healthcare support such as **PEKA B40, mySALAM, SOCSO/PERKESO, Skim Perubatan Madani,** and **Tabung Bantuan Perubatan**.

This happens because:
- Government information is scattered across multiple websites and portals  
- Eligibility rules and application steps are difficult to understand  
- Elderly users and low digital literacy users find official portals hard to use  
- Rural communities and migrant workers face language and awareness barriers  
- Users do not know which scheme they are eligible for or how to apply  

This causes:
- ❌ Missed financial and healthcare assistance  
- ❌ Confusion about eligibility and benefits  
- ❌ Delayed access to treatment or support  
- ❌ Increased burden on hotlines and hospitals  

---

## 💡 Solution

CareBridge transforms complex healthcare policies into **simple, step-by-step guidance** through a chat-based interface.

It helps users:
- Understand available healthcare schemes  
- Check eligibility  
- Learn benefits  
- Get clear application steps  
- Find nearby clinics  

---

## 🚀 Core Features

### 💬 Multilingual AI Chatbot
- Supports 7 languages (EN, BM, ZH, TA, ID, TL, VI)  
- Simplifies complex policy information  
- Localized for Malaysian healthcare schemes  

### 📱 WhatsApp-Style Interface
- Familiar chat UI  
- Easy for low digital literacy users  

### 🧠 Eligibility Quiz
- 4-question pre-screening  
- Suggests suitable schemes  

### 📄 Policy Summarizer
- Converts policies into simple bullet points  
- Covers eligibility, benefits, and application steps  

### 🎤 Voice Input
- Speech-to-text support  
- Improves accessibility  

### 📍 Clinic Finder
- Finds nearby clinics  
- Uses Google Maps search  

### 🔎 Real-Time Information
- Retrieves relevant info from official sources  

---

## 🌟 Extra Value

- Inclusive for elderly, rural users, and migrant workers  
- Reduces confusion from fragmented information  
- Supports public awareness  
- Reduces workload for hospitals and agencies  

---

## 🔮 Future Improvements

- Government API integration  
- Real-time eligibility verification (official data)  
- Mobile app version  
- Offline / low-internet support  
- AI personalization  
- Multi-sector expansion:
  - Housing  
  - Welfare  
  - Financial aid  
  - Education  

---

## 🛠️ Technology Stack

### Frontend
- HTML5  
- CSS3  
- JavaScript (Vanilla)  

### Backend & RAG
- FastAPI  
- Python  
- Jinja  

### APIs / Services
- SEALION API  
- Web Speech API  
- Google Maps  

---

## 👥 Target Users

- B40 & M40 Malaysians  
- Elderly users  
- Rural communities  
- Non-English speakers  
- First-time healthcare users  
- Migrant workers  

---

## 💼 Business Model

### Free Access
- Free chatbot usage  
- Eligibility checking  
- Multilingual support  

### Institutional Value
- Government & NGO adoption  
- Public awareness  
- Pre-screening users  
- Reduce workload  

### Future Expansion
- Personalized recommendations  
- System integration  
- Multi-sector services  

---

## 📊 Competitor Analysis

| Competitor           | Limitation                          |
|---------------------|------------------------------------|
| Government websites | Complex, hard to navigate          |
| Google search       | Too much unstructured information  |
| Generic chatbots    | Not localized                      |

### Our Advantage
- Malaysia-specific  
- Simple language  
- Step-by-step guidance  
- Eligibility checking  
- Multilingual support  

---

## 📁 Project Structure

```bash
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
```
---

## ⚙️ Getting Started

Prerequisites
Python 3.10+
pip
SealionAI API key

Installation
1. Clone the repository
git clone https://github.com/your-username/carebridge.git
cd carebridge

3. Create virtual environment
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
SEALION_API_KEY=your_api_key_here

6. Run the application
uvicorn app.main:app --reload

7. Open in browser
http://127.0.0.1:8000

---

## 📋 Example User Flows

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

## 🎯 Project Impact

CareBridge can improve public healthcare access in Malaysia by:
Simplifying complicated healthcare policies
Making government support easier to understand
Helping users identify relevant schemes faster
Increasing awareness among underserved communities
Reducing confusion and misinformation
Supporting inclusive access through multilingual and voice-based interaction

---

## ✅ Key Highlights

Multilingual public service assistant
Healthcare-scheme focused
Built for accessibility and inclusion
Combines AI guidance with structured local logic
Practical and scalable for real-world public use

---

## 🤝 Contributing

Fork the repository
Create a new branch
Make your changes
Commit your updates
Submit a pull request

---

## 📄 References

Official PEKA B40 website
Official mySALAM website
Official PERKESO website
Official Skim Perubatan Madani website
Official Ministry of Health Malaysia resources
Replace with your actual links if needed.

## 🆘 Support

If you have questions or suggestions, please open an issue in the repository.
Built with ❤️ to make Malaysian public healthcare support more accessible and inclusive.

