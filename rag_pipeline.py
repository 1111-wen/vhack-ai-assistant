"""
rag_pipeline.py
---------------
TRUE RAG pipeline — fetches live content from official Malaysian
government websites before every answer, so information is always
up-to-date.

Flow:
  1. Detect which scheme the user is asking about
  2. Search the web for that scheme's official page
  3. Feed the fresh content into the SEA-LION system prompt
  4. SEA-LION answers grounded in live data

V Hack 2026 — Case Study 4: The Inclusive Citizen
"""

import httpx
import re
from language_utils import get_language_instruction

# ── Official source URLs per scheme ───────────────────────────────────────────
SCHEME_SOURCES = {
    "peka_b40": {
        "name": "PEKA B40 Official",
        "url": "https://protecthealth.com.my/peka-b40-eng/",
        "keywords": ["peka", "peka b40", "peduli kesihatan", "health screening",
                     "saringan kesihatan", "b40 screening"],
    },
    "mysalam": {
        "name": "mySALAM Official",
        "url": "https://www.mysalam.com.my",
        "keywords": ["mysalam", "my salam", "salam", "critical illness", "penyakit kritikal",
                     "hospitalisation allowance", "cash payout", "takaful"],
    },
    "tbp": {
        "name": "MOH Malaysia — Tabung Bantuan Perubatan",
        "url": "https://www.moh.gov.my",
        "keywords": ["tbp", "tabung bantuan", "tabung bantuan perubatan",
                     "medical assistance fund", "medical social", "kerja sosial perubatan"],
    },
    "madani": {
        "name": "Skim Perubatan Madani Official",
        "url": "https://protecthealth.com.my/skimperubatanmadani-ms/",
        "keywords": ["madani", "skim perubatan madani", "skim perubatan",
                     "free clinic", "klinik percuma", "klinik panel"],
    },
    "socso": {
        "name": "SOCSO / PERKESO Official",
        "url": "https://www.perkeso.gov.my/en/our-services/protection/employment-injury-scheme",
        "keywords": ["socso", "perkeso", "work accident", "kemalangan kerja",
                     "employment injury", "occupational disease", "penyakit pekerjaan"],
    },
}

# ── Fallback knowledge base (used if live fetch fails) ────────────────────────
FALLBACK_KNOWLEDGE = """
PEKA B40: Free health screening for STR recipients aged 40+. Up to RM20,000 medical equipment aid, RM1,000 cancer treatment incentive. No registration needed. Visit www.pekab40.com.my

mySALAM: Free national takaful for B40. RM8,000 payout for 50 critical illnesses. RM50/day hospitalisation allowance (max 14 days). Auto-enrolled for STR recipients. www.mysalam.com.my

Tabung Bantuan Perubatan (TBP): MOH fund for patients who cannot afford government hospital bills. Apply through Medical Social Officer at the hospital. www.moh.gov.my

Skim Perubatan Madani: Free minor illness treatment at panel clinics for STR recipients. RM250/year (household), RM125 (senior), RM75 (single). 10 districts only. www.moh.gov.my

SOCSO/PERKESO: Work accident protection for employees. Unlimited medical coverage, 80% daily wage during recovery, permanent disability pension. Careline: 1-300-22-8000. www.perkeso.gov.my
"""


def detect_scheme(user_text: str) -> str | None:
    """
    Detect which scheme the user is asking about.
    Returns scheme key or None if unclear / general question.
    """
    text_lower = user_text.lower()
    for scheme_key, info in SCHEME_SOURCES.items():
        if any(kw in text_lower for kw in info["keywords"]):
            return scheme_key
    return None


def fetch_page_content(url: str, timeout: int = 8) -> str:
    """
    Fetch text content from a URL.
    Returns plain text, stripped of HTML tags.
    Max 3000 chars to keep prompt size manageable.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; HealthcareHelperMY/1.0)",
            "Accept": "text/html,application/xhtml+xml",
        }
        response = httpx.get(url, headers=headers, timeout=timeout, follow_redirects=True)
        if response.status_code != 200:
            return ""

        # Strip HTML tags
        text = re.sub(r"<[^>]+>", " ", response.text)
        # Collapse whitespace
        text = re.sub(r"\s+", " ", text).strip()
        # Return first 3000 chars — enough for key info, not too long
        return text[:3000]
    except Exception as e:
        print(f"[RAG] Fetch failed for {url}: {e}")
        return ""


def get_live_context(user_text: str) -> tuple[str, str, str]:
    """
    Main RAG function.
    1. Detect which scheme the user is asking about
    2. Fetch live content from official source
    3. Return (context_text, source_name, source_url)
    """
    scheme_key = detect_scheme(user_text)

    if scheme_key:
        source = SCHEME_SOURCES[scheme_key]
        print(f"[RAG] Detected scheme: {scheme_key} → fetching {source['url']}")
        live_content = fetch_page_content(source["url"])

        if live_content:
            print(f"[RAG] Live fetch successful — {len(live_content)} chars")
            return live_content, source["name"], source["url"]
        else:
            print(f"[RAG] Live fetch failed — using fallback knowledge base")
            return FALLBACK_KNOWLEDGE, source["name"], source["url"]
    else:
        # General question — use full fallback knowledge
        print(f"[RAG] No specific scheme detected — using fallback knowledge base")
        return FALLBACK_KNOWLEDGE, None, None


def build_system_prompt(lang_code: str, live_context: str, source_name: str = None, source_url: str = None) -> str:
    """
    Build the full system prompt with live-fetched context injected.
    """
    lang_instruction = get_language_instruction(lang_code)

    source_note = ""
    if source_name and source_url:
        source_note = f"\nThis context was retrieved LIVE from: {source_name} ({source_url})\n"

    return f"""You are HealthCare Helper MY — a warm, friendly AI assistant built for V Hack 2026 (Case Study 4: The Inclusive Citizen).

Your mission: Help Malaysian citizens — especially B40, elderly, migrant workers, and rural communities — understand government healthcare schemes in simple everyday language.

LANGUAGE RULE:
{lang_instruction}

LIVE RETRIEVED CONTEXT (use this as your primary source of truth):
=================================================================
{source_note}
{live_context}
=================================================================

STRICT RULES:
1. Only answer questions about these 5 Malaysian healthcare schemes:
   PEKA B40, mySALAM, Tabung Bantuan Perubatan (TBP), Skim Perubatan Madani, SOCSO/PERKESO.

2. If the user asks something OUTSIDE these 5 schemes, set "out_of_scope": true.
   Politely redirect and suggest one relevant scheme. Do NOT answer off-topic questions.

3. Use SIMPLE language — explain like you're talking to someone's grandmother.
   Short sentences. No jargon. Always use bullet points (•) for any list of 2+ items.

4. Keep answers SHORT and practical. FORMAT RULES:
   - ALWAYS simplify complex government/legal language into plain simple words
   - Use bullet points (•) for any list, each bullet max 10 words
   - Target reading level: Standard 5 student (10-11 years old)
   - Replace jargon: "beneficiary" → "person who receives aid"
   - Replace jargon: "eligible" → "can get this"  
   - Replace jargon: "takaful" → "free insurance protection"
   - Max 5 bullets per answer
   - Never copy paste raw government text — always rewrite in simple words

5. Always cite the official source URL.

6. If eligibility is unclear, ask ONE short clarifying question
   (e.g. "Are you a STR recipient?" or "Is this a work-related injury?").

7. Be warm, empathetic, and encouraging.
   People asking may be in financial hardship or dealing with illness.

8. If the live context does not contain the answer, say:
   "I'm not sure about that detail — please check [official website] directly."
   NEVER make up numbers, amounts, or eligibility rules.

RESPOND WITH ONLY VALID JSON (no markdown, no code fences):
{{
  "reply": "your answer in the selected language",
  "source_name": "{source_name or 'Official Malaysian Government Source'}",
  "source_url": "{source_url or 'https://www.moh.gov.my'}",
  "follow_up_chips": ["short question 1", "short question 2", "short question 3"],
  "out_of_scope": false
}}

Rules for follow_up_chips:
- Max 3 chips, each 5 words or less
- Write in the SAME language as the reply
- Should be natural follow-up questions the user might ask
"""
