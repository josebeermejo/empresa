"""Text normalizer"""


def normalize(value: str, config: dict = None) -> str:
    """
    Normalize text (trim whitespace, optional case normalization)

    Args:
        value: Input text
        config: Optional configuration
            - lowercase: bool (default False)
            - strip_accents: bool (default False)

    Returns:
        Normalized text
    """
    if not value:
        return value

    text = str(value).strip()

    # Optional lowercase
    if config and config.get("lowercase", False):
        text = text.lower()

    # Optional strip accents (basic implementation)
    if config and config.get("strip_accents", False):
        text = strip_accents(text)

    return text


def strip_accents(text: str) -> str:
    """
    Remove accents from text (basic Spanish)

    Args:
        text: Input text

    Returns:
        Text without accents
    """
    accent_map = {
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "ñ": "n",
        "Á": "A",
        "É": "E",
        "Í": "I",
        "Ó": "O",
        "Ú": "U",
        "Ñ": "N",
        "ü": "u",
        "Ü": "U",
    }

    for accented, plain in accent_map.items():
        text = text.replace(accented, plain)

    return text
