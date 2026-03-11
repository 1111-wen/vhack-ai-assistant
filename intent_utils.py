def detect_intent(question):
    q = question.lower().strip()

    # requirements first
    if (
        "requirement" in q
        or "requirements" in q
        or "required" in q
        or "syarat" in q
        or "dokumen" in q
        or "document" in q
        or "documents" in q
    ):
        return "requirements"

    # eligibility second
    if (
        "who" in q
        or "eligibility" in q
        or "eligible" in q
        or "layak" in q
        or "kelayakan" in q
        or "siapa" in q
    ):
        return "eligibility"

    # steps last
    if (
        "how" in q
        or "cara" in q
        or "bagaimana" in q
        or "langkah" in q
        or "step" in q
        or "steps" in q
        or "mohon" in q
        or "memohon" in q
        or "permohonan" in q
    ):
        return "steps"

    return "general"