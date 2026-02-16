"""Duplicates detector using fuzzy matching"""
from typing import List
import pandas as pd
from rapidfuzz import fuzz
from app.schemas import Issue, IssueKind, Severity
from app.config import settings
from app.utils import hash_row


def detect(df: pd.DataFrame, column: str = None, config: dict = None) -> List[Issue]:
    """
    Detect duplicate rows using fuzzy matching

    Args:
        df: DataFrame to check
        column: Not used for duplicates (checks entire rows)
        config: Optional configuration (dup_threshold, dup_key_columns)

    Returns:
        List of Issue objects
    """
    issues = []

    # Get config
    threshold = config.get("dup_threshold", settings.dup_threshold) if config else settings.dup_threshold
    key_columns = (
        config.get("dup_key_columns", settings.dup_key_columns_list)
        if config
        else settings.dup_key_columns_list
    )

    # Filter to key columns that exist in df
    available_keys = [col for col in key_columns if col in df.columns]

    if not available_keys:
        # Fallback: use all string columns
        available_keys = df.select_dtypes(include=["object"]).columns.tolist()[:2]

    if not available_keys:
        return issues

    # Create composite key for each row
    seen = {}  # hash -> (row_index, values)

    for idx in range(len(df)):
        row = df.iloc[idx]

        # Build composite key
        key_values = {}
        for col in available_keys:
            val = row.get(col, "")
            key_values[col] = str(val).strip().lower() if pd.notna(val) else ""

        # Compute hash
        row_hash = hash_row(key_values, available_keys)

        # Check for exact hash match first
        if row_hash in seen:
            dup_idx, dup_values = seen[row_hash]
            issues.append(
                Issue(
                    kind=IssueKind.DUPLICATE,
                    severity=Severity.WARN,
                    row=idx,
                    col=None,
                    details={
                        "duplicate_of": dup_idx,
                        "match_fields": available_keys,
                        "similarity": 1.0,
                        "method": "exact",
                    },
                )
            )
            continue

        # Check for fuzzy matches
        for existing_hash, (existing_idx, existing_values) in seen.items():
            # Compare values using fuzzy matching
            similarities = []
            for col in available_keys:
                val1 = key_values.get(col, "")
                val2 = existing_values.get(col, "")

                if val1 and val2:
                    similarity = fuzz.ratio(val1, val2) / 100.0
                    similarities.append(similarity)

            if similarities:
                avg_similarity = sum(similarities) / len(similarities)

                if avg_similarity >= threshold:
                    issues.append(
                        Issue(
                            kind=IssueKind.DUPLICATE,
                            severity=Severity.WARN,
                            row=idx,
                            col=None,
                            details={
                                "duplicate_of": existing_idx,
                                "match_fields": available_keys,
                                "similarity": round(avg_similarity, 2),
                                "method": "fuzzy",
                            },
                        )
                    )
                    break

        # Store this row
        seen[row_hash] = (idx, key_values)

    return issues
