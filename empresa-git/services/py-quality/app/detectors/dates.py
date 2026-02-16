"""Date format detector"""
from typing import List, Set
import pandas as pd
from app.schemas import Issue, IssueKind, Severity


def detect(df: pd.DataFrame, column: str, config: dict = None) -> List[Issue]:
    """
    Detect inconsistent date formats in a column

    Checks if dates use mixed formats (DD/MM/YYYY vs YYYY-MM-DD, etc.)

    Args:
        df: DataFrame to check
        column: Column name to check
        config: Optional configuration

    Returns:
        List of Issue objects
    """
    issues = []

    if column not in df.columns:
        return issues

    # Track detected formats
    formats_found: Set[str] = set()
    values_by_format = {}

    for idx, value in df[column].items():
        # Skip if empty/null
        if pd.isna(value) or str(value).strip() == "":
            continue

        value_str = str(value).strip()

        # Try to detect format
        detected_format = detect_date_format(value_str)

        if detected_format:
            formats_found.add(detected_format)
            if detected_format not in values_by_format:
                values_by_format[detected_format] = []
            values_by_format[detected_format].append((int(idx), value_str))

    # If multiple formats found, report as issues
    if len(formats_found) > 1:
        # Determine which format is most common
        format_counts = {fmt: len(vals) for fmt, vals in values_by_format.items()}
        dominant_format = max(format_counts, key=format_counts.get)

        # Report non-dominant formats as issues
        for fmt, occurrences in values_by_format.items():
            if fmt != dominant_format:
                for row_idx, value_str in occurrences:
                    issues.append(
                        Issue(
                            kind=IssueKind.DATE_FORMAT,
                            severity=Severity.WARN,
                            row=row_idx,
                            col=column,
                            details={
                                "value": value_str,
                                "detected_format": fmt,
                                "dominant_format": dominant_format,
                                "reason": f"Inconsistent date format. Found {fmt}, expected {dominant_format}",
                            },
                        )
                    )

    return issues


def detect_date_format(value: str) -> str | None:
    """
    Detect the date format of a string

    Returns:
        Format string like "DD/MM/YYYY" or None if not recognized
    """
    # Common separators
    if "/" in value:
        sep = "/"
    elif "-" in value:
        sep = "-"
    elif "." in value:
        sep = "."
    else:
        return None

    parts = value.split(sep)
    if len(parts) != 3:
        return None

    p1_len = len(parts[0])
    p2_len = len(parts[1])
    p3_len = len(parts[2])

    # YYYY-MM-DD or YYYY/MM/DD
    if p1_len == 4:
        return f"YYYY{sep}MM{sep}DD"

    # DD-MM-YYYY or DD/MM/YYYY
    if p3_len == 4:
        return f"DD{sep}MM{sep}YYYY"

    # DD-MM-YY or DD/MM/YY
    if p3_len == 2:
        return f"DD{sep}MM{sep}YY"

    # MM-DD-YY or MM/DD/YY
    if p1_len <= 2 and p2_len <= 2 and p3_len == 2:
        return f"MM{sep}DD{sep}YY"

    return None
