
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def load_knowledge_base() -> str:
    """Read all .txt files in /data and return combined text."""
    combined = []
    for filename in sorted(os.listdir(DATA_DIR)):
        if filename.endswith(".txt"):
            filepath = os.path.join(DATA_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                combined.append(f.read())
    return "\n\n".join(combined)


# Pre-load once at import time so app.py doesn't reload on every request
KNOWLEDGE_BASE_TEXT = load_knowledge_base()
