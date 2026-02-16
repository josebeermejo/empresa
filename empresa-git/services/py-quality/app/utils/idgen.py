"""ID generation utilities"""
from app.utils.hashing import hash_string
import time


def generate_id(prefix: str = "ID", value: str = None) -> str:
    """
    Generate a unique ID

    Args:
        prefix: ID prefix (default "ID")
        value: Optional value to hash (uses timestamp if not provided)

    Returns:
        Generated ID in format: PREFIX-HASH
    """
    if value is None:
        value = str(time.time())

    hash_part = hash_string(value, length=8)
    return f"{prefix}-{hash_part}"


def generate_row_id(row_index: int, row_data: str = "") -> str:
    """
    Generate an ID for a row

    Args:
        row_index: Row index
        row_data: Optional row data to include in hash

    Returns:
        Generated ID
    """
    combined = f"{row_index}:{row_data}"
    return generate_id("ID", combined)
