"""Phone (Spanish) detector"""
import re
from typing import List
import pandas as pd
from app.schemas import Issue, IssueKind, Severity
from app.config import settings


def normalize_phone(value: str) -> str:
    """Remove all non-digit and non-plus characters"""
    return re.sub(r"[^\d+]", "", value)


def detect(df: pd.DataFrame, column: str, config: dict = None) -> List[Issue]:
    """
    Detect invalid Spanish phone numbers

    Expected format: +34 followed by 9 digits
    Also accepts national format (9 digits) but suggests adding +34

    Args:
        df: DataFrame to check
        column: Column name to check
        config: Optional configuration (phone_cc, phone_length)

    Returns:
        List of Issue objects
    """
    issues = []

    if column not in df.columns:
        return issues

    phone_cc = config.get("phone_cc", settings.phone_cc) if config else settings.phone_cc
    phone_length = (
        config.get("phone_length", settings.phone_length) if config else settings.phone_length
    )

    for idx, value in df[column].items():
        # Skip if empty/null
        if pd.isna(value) or str(value).strip() == "":
            continue

        value_str = str(value).strip()
        normalized = normalize_phone(value_str)

        # Check format
        issue_found = False
        reason = None

        if normalized.startswith("+"):
            # International format
            expected_total_length = len(phone_cc) + phone_length
            if len(normalized) != expected_total_length:
                issue_found = True
                reason = f"Expected {expected_total_length} characters with {phone_cc}, got {len(normalized)}"
            elif not normalized.startswith(phone_cc):
                issue_found = True
                reason = f"Expected country code {phone_cc}"
        else:
            # National format - suggest adding country code
            if len(normalized) == phone_length:
                issues.append(
                    Issue(
                        kind=IssueKind.PHONE_INVALID,
                        severity=Severity.WARN,
                        row=int(idx),
                        col=column,
                        details={
                            "value": value_str,
                            "normalized": normalized,
                            "reason": f"Missing country code {phone_cc}",
                            "suggestion": f"{phone_cc}{normalized}",
                        },
                    )
                )
                continue
            else:
                issue_found = True
                reason = f"Expected {phone_length} digits, got {len(normalized)}"

        if issue_found:
            issues.append(
                Issue(
                    kind=IssueKind.PHONE_INVALID,
                    severity=Severity.ERROR,
                    row=int(idx),
                    col=column,
                    details={
                        "value": value_str,
                        "normalized": normalized,
                        "reason": reason,
                    },
                )
            )

    return issues
