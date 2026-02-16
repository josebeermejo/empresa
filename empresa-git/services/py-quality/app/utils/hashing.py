"""Hashing utilities for deduplication"""
import hashlib
from typing import Any


def hash_string(s: str, length: int = 8) -> str:
    """
    Generate a short hash of a string

    Args:
        s: Input string
        length: Length of output hash (default 8)

    Returns:
        Hex hash string
    """
    return hashlib.sha256(s.encode()).hexdigest()[:length]


def hash_row(row_dict: dict[str, Any], keys: list[str]) -> str:
    """
    Generate a hash from specific keys in a row

    Args:
        row_dict: Dictionary representing a row
        keys: Keys to include in hash

    Returns:
        Hex hash string
    """
    # Concatenate values for specified keys
    values = []
    for key in keys:
        val = row_dict.get(key, "")
        # Convert to string and normalize
        val_str = str(val).strip().lower() if val is not None else ""
        values.append(val_str)

    combined = "|".join(values)
    return hash_string(combined)


def hash_value(value: Any) -> str:
    """
    Generate a hash from any value

    Args:
        value: Input value

    Returns:
        Hex hash string
    """
    val_str = str(value) if value is not None else ""
    return hash_string(val_str)
