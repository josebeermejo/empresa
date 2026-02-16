"""Date normalizer"""
from datetime import datetime
from typing import Optional


# Common date formats to try
DATE_FORMATS = [
    "%Y-%m-%d",  # ISO: 2024-01-15
    "%d/%m/%Y",  # European: 15/01/2024
    "%d-%m-%Y",  # European dash: 15-01-2024
    "%d.%m.%Y",  # European dot: 15.01.2024
    "%m/%d/%Y",  # US: 01/15/2024
    "%m-%d-%Y",  # US dash: 01-15-2024
    "%d/%m/%y",  # Short year: 15/01/24
    "%d-%m-%y",  # Short year dash: 15-01-24
    "%Y/%m/%d",  # ISO slash: 2024/01/15
]


def normalize(value: str, config: dict = None) -> Optional[str]:
    """
    Normalize date to ISO format (YYYY-MM-DD)

    Args:
        value: Input date string
        config: Optional configuration

    Returns:
        Normalized date in YYYY-MM-DD format, or None if cannot parse
    """
    if not value:
        return None

    value_str = str(value).strip()

    # Try each format
    for fmt in DATE_FORMATS:
        try:
            dt = datetime.strptime(value_str, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue

    # Could not parse
    return None
