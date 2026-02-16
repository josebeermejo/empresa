"""ID/SKU detector"""
from typing import List
import pandas as pd
from app.schemas import Issue, IssueKind, Severity


def detect(df: pd.DataFrame, column: str, config: dict = None) -> List[Issue]:
    """
    Detect missing or empty IDs/SKUs

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
        # Check if empty/null
        is_empty = pd.isna(value) or str(value).strip() == ""

        if is_empty:
            issues.append(
                Issue(
                    kind=IssueKind.ID_MISSING,
                    severity=Severity.ERROR,
                    row=int(idx),
                    col=column,
                    details={
                        "reason": "Required ID field is empty",
                    },
                )
            )

    return issues
