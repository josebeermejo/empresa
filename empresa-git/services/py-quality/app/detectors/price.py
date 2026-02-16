"""Price detector"""
from typing import List
import pandas as pd
from app.schemas import Issue, IssueKind, Severity


def detect(df: pd.DataFrame, column: str, config: dict = None) -> List[Issue]:
    """
    Detect price issues (zero or negative values)

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
        if pd.isna(value):
            continue

        # Try to convert to float
        try:
            price = float(value)
        except (ValueError, TypeError):
            continue

        # Check for zero
        if price == 0:
            issues.append(
                Issue(
                    kind=IssueKind.PRICE_ZERO,
                    severity=Severity.WARN,
                    row=int(idx),
                    col=column,
                    details={
                        "value": price,
                        "reason": "Zero price may indicate missing data",
                    },
                )
            )

        # Check for negative
        elif price < 0:
            issues.append(
                Issue(
                    kind=IssueKind.PRICE_NEGATIVE,
                    severity=Severity.ERROR,
                    row=int(idx),
                    col=column,
                    details={
                        "value": price,
                        "reason": "Negative prices are invalid",
                    },
                )
            )

    return issues
