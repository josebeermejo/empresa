"""NIF/CIF basic detector (superficial validation)"""
import re
from typing import List
import pandas as pd
from app.schemas import Issue, IssueKind, Severity


# Basic pattern: 8-10 alphanumeric characters, often letter at start or end
NIF_CIF_PATTERN = re.compile(r"^[A-Z0-9]{8,10}$")


def detect(df: pd.DataFrame, column: str, config: dict = None) -> List[Issue]:
    """
    Basic NIF/CIF validation (pattern-based, not exhaustive)

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

    for idx, value in df[column].items():
        # Skip if empty/null
        if pd.isna(value) or str(value).strip() == "":
            continue

        value_str = str(value).strip().upper()

        # Check basic pattern
        if not NIF_CIF_PATTERN.match(value_str):
            issues.append(
                Issue(
                    kind=IssueKind.NIF_CIF_BASIC,
                    severity=Severity.WARN,
                    row=int(idx),
                    col=column,
                    details={
                        "value": value_str,
                        "reason": "Does not match typical NIF/CIF pattern (8-10 alphanumeric characters)",
                    },
                )
            )

    return issues
