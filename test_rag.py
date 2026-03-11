from translator import detect_language

# simple functional smoke test
query = "How do I apply for healthcare assistance?"
assert detect_language(query) == "eng_Latn"

if search_docs is not None:
    result = search_docs(query)
    print(result)
else:
    print("search_docs unavailable, skipping retrieval test")

# test detection for a few other languages (mapping is coarse)
for sample, expected in [
    ("Apa khabar?", "zsm_Latn"),
    ("你好", "zho_Hans"),
    ("எப்படி இருக்கிறீர்கள்?", "tam_Taml"),
]:
    detected = detect_language(sample)
    assert detected == expected, f"{sample} -> {detected} (want {expected})"

    # round-trip through translation to verify the pipeline functions
    eng = translate_to_english(sample, detected)
    back = translate_from_english(eng, detected)
    assert isinstance(back, str)
    print(f"{sample} -> {eng} -> {back}")