"""Currency detector"""
import re
from typing import List
import pandas as pd
from app.schemas import Issue, IssueKind, Severity


# Currency symbols and codes
CURRENCY_SYMBOLS = ["€", "$", "£", "¥"]
CURRENCY_CODES = ["EUR", "USD", "GBP", "JPY"]


def detect(df: pd.DataFrame, column: str, config: dict = None) -> List[Issue]:
    """
    Detect currency format issues

    Checks for:
    - Unparseable currency values
    - Mixed currency symbols
    - Invalid formats

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

    currencies_found = set()

    for idx, value in df[column].items():
        # Skip if empty/null
        if pd.isna(value) or str(value).strip() == "":
            continue

        value_str = str(value).strip()

        # Detect currency symbol/code
        currency_detected = None
        for symbol in CURRENCY_SYMBOLS:
            if symbol in value_str:
                currency_detected = symbol
                currencies_found.add(symbol)
                break

        if not currency_detected:
            for code in CURRENCY_CODES:
                if code in value_str.upper():
                    currency_detected = code
                    currencies_found.add(code)
                    break

        # Try to extract numeric value
        # Remove currency symbols and codes
        numeric_str = value_str
        for symbol in CURRENCY_SYMBOLS + CURRENCY_CODES:
            numeric_str = numeric_str.replace(symbol, "")

        # Replace comma with dot (European format)
        numeric_str = numeric_str.replace(",", ".").strip()

        # Try to parse as float
        try:
            float(numeric_str)
        except ValueError:
            issues.append(
                Issue(
                    kind=IssueKind.CURRENCY,
                    severity=Severity.ERROR,
                    row=int(idx),
                    col=column,
                    details={
                        "value": value_str,
                        "reason": "Cannot parse numeric value from currency string",
                    },
                )
            )

    # Check for mixed currencies
    if len(currencies_found) > 1:
        # Add warning about mixed currencies (only once)
        issues.append(
            Issue(
                kind=IssueKind.CURRENCY,
                severity=Severity.WARN,
                row=None,
                col=column,
                details={
                    "reason": f"Mixed currencies detected: {', '.join(currencies_found)}",
                    "currencies": list(currencies_found),
                },
            )
        )

    return issues
