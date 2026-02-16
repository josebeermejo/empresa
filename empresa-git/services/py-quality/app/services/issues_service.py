"""Issues detection service"""
from typing import List, Dict, Any
import pandas as pd
from app.schemas import Issue, InputSpec, DetectIssuesResponse
from app.io_utils import load_frame
from app.detectors import email, phone_es, dates, currency, duplicates, price, id_sku, nif_cif_basic


def detect_issues(spec: InputSpec) -> DetectIssuesResponse:
    """
    Detect all data quality issues in a dataset

    Args:
        spec: Input specification

    Returns:
        DetectIssuesResponse with issues and summary
    """
    df = load_frame(spec)

    all_issues: List[Issue] = []

    # Detect by column type (heuristically)
    for col in df.columns:
        col_lower = col.lower()

        # Email columns
        if "email" in col_lower or "mail" in col_lower or "correo" in col_lower:
            all_issues.extend(email.detect(df, col))

        # Phone columns
        if ("phone" in col_lower or "telefono" in col_lower or "tel" in col_lower or "móvil" in col_lower or "movil" in col_lower):
            all_issues.extend(phone_es.detect(df, col))

        # Date columns
        if "fecha" in col_lower or "date" in col_lower or "born" in col_lower:
            all_issues.extend(dates.detect(df, col))

        # Currency columns
        if "precio" in col_lower or "price" in col_lower or "cost" in col_lower or "amount" in col_lower:
            # Check both currency format and zero/negative
            all_issues.extend(currency.detect(df, col))
            all_issues.extend(price.detect(df, col))

        # ID columns
        if "id" in col_lower or "sku" in col_lower or "code" in col_lower or "codigo" in col_lower:
            all_issues.extend(id_sku.detect(df, col))

        # NIF/CIF columns
        if "nif" in col_lower or "cif" in col_lower or "dni" in col_lower:
            all_issues.extend(nif_cif_basic.detect(df, col))

    # Detect duplicates (row-level)
    all_issues.extend(duplicates.detect(df))

    # Calculate summary
    summary = calculate_summary(all_issues, df)

    return DetectIssuesResponse(issues=all_issues, summary=summary)


def calculate_summary(issues: List[Issue], df: pd.DataFrame) -> Dict[str, Any]:
    """
    Calculate summary statistics for issues

    Args:
        issues: List of issues
        df: DataFrame

    Returns:
        Summary dictionary
    """
    from collections import Counter
    from app.schemas import IssueKind, Severity

    kind_counts = Counter(issue.kind for issue in issues)
    severity_counts = Counter(issue.severity for issue in issues)

    summary = {
        "total_issues": len(issues),
        "by_kind": dict(kind_counts),
        "by_severity": dict(severity_counts),
        "affected_rows": len(set(issue.row for issue in issues if issue.row is not None)),
        "total_rows": len(df),
    }

    return summary
