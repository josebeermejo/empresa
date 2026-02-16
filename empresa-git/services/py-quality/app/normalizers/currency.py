"""Currency normalizer"""
import re
from typing import Tuple, Optional


CURRENCY_SYMBOLS = ["€", "$", "£", "¥"]
CURRENCY_CODES = ["EUR", "USD", "GBP", "JPY"]


def normalize(value: str, config: dict = None) -> Tuple[Optional[float], str]:
    """
    Normalize currency value

    Args:
        value: Input currency string (e.g., "€1.234,56" or "1234.56 EUR")
        config: Optional configuration

    Returns:
        Tuple of (numeric_value, currency_code)
        Returns (None, "") if cannot parse
    """
    if not value:
        return None, ""

    value_str = str(value).strip()

    # Detect currency
    currency_code = "EUR"  # Default
    for symbol in CURRENCY_SYMBOLS:
        if symbol in value_str:
            if symbol == "€":
                currency_code = "EUR"
            elif symbol == "$":
                currency_code = "USD"
            elif symbol == "£":
                currency_code = "GBP"
            elif symbol == "¥":
                currency_code = "JPY"
            break

    for code in CURRENCY_CODES:
        if code in value_str.upper():
            currency_code = code
            break

    # Extract numeric part
    numeric_str = value_str

    # Remove currency symbols and codes
    for symbol in CURRENCY_SYMBOLS + CURRENCY_CODES:
        numeric_str = numeric_str.replace(symbol, "")

    numeric_str = numeric_str.strip()

    # Handle European format (comma as decimal separator)
    # If there are both dots and commas, assume European format
    if "." in numeric_str and "," in numeric_str:
        # Remove dots (thousands separator) and replace comma with dot
        numeric_str = numeric_str.replace(".", "").replace(",", ".")
    elif "," in numeric_str:
        # Only commas - replace with dot
        numeric_str = numeric_str.replace(",", ".")

    # Try to parse
    try:
        numeric_value = float(numeric_str)
        return numeric_value, currency_code
    except ValueError:
        return None, ""
