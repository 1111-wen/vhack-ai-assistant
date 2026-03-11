from lingua import Language, LanguageDetectorBuilder

languages = [
    Language.ENGLISH,
    Language.MALAY,
    Language.CHINESE,
    Language.TAMIL
]

detector = LanguageDetectorBuilder.from_languages(*languages).build()

def detect_language(text):
    try:
        detected = detector.detect_language_of(text)

        lang_map = {
            Language.ENGLISH: "eng_Latn",
            Language.MALAY: "zsm_Latn",
            Language.CHINESE: "zho_Hans",
            Language.TAMIL: "tam_Taml"
        }

        return lang_map.get(detected, "eng_Latn")
    except:
        return "eng_Latn"