"""
app.py — HealthCare Helper MY
FastAPI backend with TRUE RAG:
  - Fetches live content from official gov websites per question
  - Feeds fresh context to SEA-LION v4 (fallback: Groq)
  - Returns grounded, up-to-date answers

Run: uvicorn app:app --reload --port 8000
"""

import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from openai import OpenAI

from intent_utils import is_healthcare_related
from language_utils import get_welcome_message
from rag_pipeline import get_live_context, build_system_prompt

load_dotenv()

SEALION_API_KEY = os.getenv("SEALION_API_KEY", "")
GROQ_API_KEY    = os.getenv("GROQ_API_KEY", "")

sealion_client = OpenAI(
    api_key=SEALION_API_KEY,
    base_url="https://api.sea-lion.ai/v1",
)
groq_client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

SEALION_MODEL = "aisingapore/Apertus-SEA-LION-v4-8B-IT"
GROQ_MODEL    = "llama-3.3-70b-versatile"

app = FastAPI(title="HealthCare Helper MY", version="2.0.0")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


class ChatRequest(BaseModel):
    message: str
    lang: str = "en"

class WelcomeRequest(BaseModel):
    lang: str = "en"


def call_ai(system_prompt: str, user_message: str) -> tuple[str, str]:
    """Try SEA-LION first, fall back to Groq."""
    if SEALION_API_KEY:
        try:
            r = sealion_client.chat.completions.create(
                model=SEALION_MODEL,
                max_tokens=1000,
                timeout=15,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": user_message},
                ],
            )
            return r.choices[0].message.content or "", "SEA-LION v4"
        except Exception as e:
            print(f"[SEA-LION] Failed: {e} — trying Groq")

    if GROQ_API_KEY:
        try:
            r = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                max_tokens=1000,
                timeout=10,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": user_message},
                ],
            )
            return r.choices[0].message.content or "", "Groq (Llama 3.3)"
        except Exception as e:
            print(f"[Groq] Failed: {e}")

    raise RuntimeError("All AI providers failed. Check your API keys in .env")


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/welcome")
async def welcome(body: WelcomeRequest):
    lang = body.lang if body.lang in ("en", "bm", "zh", "ta", "id", "tl", "vi") else "en"
    chips = {
        "en": ["Am I eligible for PEKA B40?", "What is mySALAM?", "Free clinic near me?"],
        "bm": ["Adakah saya layak PEKA B40?", "Apa itu mySALAM?", "Klinik percuma berhampiran?"],
        "zh": ["我符合PEKA B40资格吗？", "什么是mySALAM？", "附近有免费诊所吗？"],
        "ta": ["நான் PEKA B40க்கு தகுதியானவரா?", "mySALAM என்றால் என்ன?", "இலவச கிளினிக் எங்கே?"],
        "id": ["Apakah saya layak PEKA B40?", "Apa itu mySALAM?", "Klinik gratis terdekat?"],
        "tl": ["Kwalipikado ba ako sa PEKA B40?", "Ano ang mySALAM?", "Libreng klinika malapit?"],
        "vi": ["Tôi có đủ điều kiện PEKA B40?", "mySALAM là gì?", "Phòng khám miễn phí gần đây?"],
    }
    return JSONResponse({
        "reply": get_welcome_message(lang),
        "source_name": None,
        "source_url": None,
        "follow_up_chips": chips.get(lang, chips["en"]),
        "out_of_scope": False,
    })


@app.post("/chat")
async def chat(body: ChatRequest):
    user_message = body.message.strip()
    lang = body.lang if body.lang in ("en", "bm", "zh", "ta", "id", "tl", "vi") else "en"

    if not user_message:
        return JSONResponse({"error": "Empty message"}, status_code=400)

    # ── Step 1: Quick intent check ─────────────────────────────────────────────
    in_scope = is_healthcare_related(user_message)
    msg_for_ai = f"[LIKELY OUT OF SCOPE] {user_message}" if not in_scope else user_message

    # ── Step 2: TRUE RAG — fetch live content from official website ────────────
    print(f"[Chat] User: {user_message[:60]}...")
    live_context, source_name, source_url = get_live_context(user_message)

    # ── Step 3: Build prompt with live context injected ────────────────────────
    system_prompt = build_system_prompt(lang, live_context, source_name, source_url)

    # ── Step 4: Call AI ────────────────────────────────────────────────────────
    try:
        raw_text, model_used = call_ai(system_prompt, msg_for_ai)
        print(f"[{model_used}] responded OK")

        try:
            clean  = raw_text.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(clean)
        except json.JSONDecodeError:
            parsed = {
                "reply": raw_text or "Sorry, I had trouble with that. Please try again.",
                "source_name": source_name,
                "source_url": source_url,
                "follow_up_chips": [],
                "out_of_scope": False,
            }

        parsed["model_used"] = model_used
        return JSONResponse(parsed)

    except RuntimeError as e:
        return JSONResponse({"error": str(e)}, status_code=503)
    except Exception as e:
        return JSONResponse({"error": f"Something went wrong: {str(e)}"}, status_code=500)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "2.0.0 — Live RAG",
        "sealion_key_set": bool(SEALION_API_KEY),
        "groq_key_set": bool(GROQ_API_KEY),
    }
