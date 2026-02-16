"""Email detector"""
import re
from typing import List
import pandas as pd
from app.schemas import Issue, IssueKind, Severity


# Simple email regex (not exhaustive, no MX check)
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def detect(df: pd.DataFrame, column: str, config: dict = None) -> List[Issue]:
    """
    Detect invalid email addresses

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

        value_str = str(value).strip()

        # Check against regex
        if not EMAIL_PATTERN.match(value_str):
            issues.append(
                Issue(
                    kind=IssueKind.EMAIL_INVALID,
                    severity=Severity.ERROR,
                    row=int(idx),
                    col=column,
                    details={
                        "value": value_str,
                        "reason": "Email format invalid",
                    },
                )
            )

    return issues
