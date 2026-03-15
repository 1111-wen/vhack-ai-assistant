# Keywords that suggest the question IS about our supported schemes
HEALTHCARE_KEYWORDS = [
    # Scheme names
    "peka", "b40", "mysalam", "salam", "tbp", "tabung bantuan",
    "madani", "skim perubatan", "socso", "perkeso",
    # General healthcare terms
    "hospital", "clinic", "klinik", "doctor", "doktor", "ubat", "medicine",
    "sakit", "ill", "sick", "treatment", "rawatan", "screening", "saringan",
    "cancer", "kanser", "stroke", "heart", "jantung", "kidney", "buah pinggang",
    "accident", "kemalangan", "injury", "luka", "disability", "cacat",
    "claim", "tuntutan", "eligible", "layak", "apply", "mohon",
    "benefit", "faedah", "payout", "wang", "bantuan", "assistance",
    "insurance", "takaful", "protection", "perlindungan",
    "b40", "m40", "str", "bsh", "bpr", "bkm", "low income", "pendapatan rendah",
]

# Keywords that strongly suggest the question is OUT of scope
OUT_OF_SCOPE_KEYWORDS = [
    "weather", "cuaca", "football", "soccer", "movie", "filem", "recipe", "resepi",
    "relationship", "love", "cinta", "dating", "homework", "kerja sekolah",
    "stock", "saham", "crypto", "bitcoin", "investment", "pelaburan",
    "housing", "rumah", "loan", "pinjaman", "ptptn", "brim",
    "visa", "passport", "travel", "holiday", "cuti",
    "politics", "politik", "election", "pilihan raya",
    "joke", "lawak", "funny", "game", "gaming",
]


def is_healthcare_related(user_text: str) -> bool:
    """
    Returns True if the question appears to be about healthcare schemes.
    Returns False if it seems clearly out of scope.
    
    Simple heuristic — AI will do the final precise check.
    """
    text_lower = user_text.lower()

    # Check for healthcare keywords
    healthcare_match = any(kw in text_lower for kw in HEALTHCARE_KEYWORDS)
    if healthcare_match:
        return True

    # Check for out-of-scope keywords
    oos_match = any(kw in text_lower for kw in OUT_OF_SCOPE_KEYWORDS)
    if oos_match:
        return False

    # Default: let the AI decide (pass through as True)
    return True
