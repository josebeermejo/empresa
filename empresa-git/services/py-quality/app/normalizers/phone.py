"""Phone normalizer"""
import re
from app.config import settings


def normalize(value: str, config: dict = None) -> str:
    """
    Normalize phone number to E.164 format

    Args:
        value: Input phone number
        config: Optional configuration (phone_cc)

    Returns:
        Normalized phone number (e.g., +34600123456)
    """
    if not value:
        return value

    phone_cc = config.get("phone_cc", settings.phone_cc) if config else settings.phone_cc

    # Remove all non-digit and non-plus characters
    cleaned = re.sub(r"[^\d+]", "", str(value))

    # If already has country code, return as-is
    if cleaned.startswith("+"):
        return cleaned

    # Add country code
    return f"{phone_cc}{cleaned}"
