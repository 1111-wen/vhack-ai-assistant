import re
import streamlit as st
from rag_pipeline import search_docs
from translator import translate_to_english, translate_from_english
from language_utils import detect_language
from intent_utils import detect_intent

def format_answer(text):
    # add line break before numbered steps
    text = re.sub(r'(\d+\.)', r'\n\1', text)

    # remove duplicate line breaks
    text = re.sub(r'\n+', '\n', text).strip()

    return text

st.set_page_config(page_title="Multilingual Government Assistant")

st.title("🌏 Multilingual Government Assistant")
st.write("Ask your question in English, Malay, Chinese, or Tamil.")

query = st.text_input("Ask your question")

pretty_lang = {
    "eng_Latn": "English",
    "zsm_Latn": "Malay",
    "zho_Hans": "Chinese",
    "tam_Taml": "Tamil"
}

if query:
    # Detect language
    detected_lang = detect_language(query)
    st.write(f"Detected language: {pretty_lang.get(detected_lang, 'English')}")

    # Translate question to English for RAG search
    english_query = translate_to_english(query, detected_lang)

    # Detect intent from original question
    intent = detect_intent(query)

    # If unclear, detect intent again from translated English
    if intent == "general":
        intent = detect_intent(english_query)

    st.write(f"Detected intent: {intent}")

    # Search document
    answer = search_docs(english_query)

    answer_lower = answer.lower()

    # Filter answer based on intent
    if intent == "steps":
        if "steps to apply:" in answer_lower:
            start = answer_lower.find("steps to apply:")
            answer = answer[start:].strip()

    elif intent == "requirements":
        if "requirements:" in answer_lower:
            start = answer_lower.find("requirements:")
            if "steps to apply:" in answer_lower[start:]:
                end = answer_lower.find("steps to apply:", start)
                answer = answer[start:end].strip()
            else:
                answer = answer[start:].strip()

    elif intent == "eligibility":
        if "eligibility:" in answer_lower:
            start = answer_lower.find("eligibility:")
            if "requirements:" in answer_lower[start:]:
                end = answer_lower.find("requirements:", start)
                answer = answer[start:end].strip()
            else:
                answer = answer[start:].strip()

    else:
        st.info("Intent unclear. Showing the most relevant information.")

    # Translate answer back to user language
    final_answer = translate_from_english(answer, detected_lang)

    formatted_answer = format_answer(final_answer)

    st.subheader("Answer")
    st.markdown(f"```\n{formatted_answer}\n```")