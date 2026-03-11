from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_NAME = "facebook/nllb-200-distilled-600M"

_tokenizer = None
_model = None


def _load_model():
    global _tokenizer, _model

    if _tokenizer is None or _model is None:
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

    return _tokenizer, _model


def _translate(text, src_lang, tgt_lang):
    tokenizer, model = _load_model()

    tokenizer.src_lang = src_lang

    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)

    forced_bos_token_id = tokenizer.convert_tokens_to_ids(tgt_lang)

    generated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=forced_bos_token_id,
        max_length=512
    )

    return tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]


def translate_to_english(text, source_lang):
    if source_lang == "eng_Latn":
        return text
    return _translate(text, source_lang, "eng_Latn")


def translate_from_english(text, target_lang):
    if target_lang == "eng_Latn":
        return text
    return _translate(text, "eng_Latn", target_lang)