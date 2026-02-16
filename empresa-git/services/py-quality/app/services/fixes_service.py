"""Fixes service for preview and application of data quality fixes"""
import os
import pandas as pd
from typing import List, Dict, Any
from app.schemas import InputSpec, FixPreview, FixResult, PreviewFixesResponse
from app.io_utils import load_frame, save_frame
from app.normalizers import phone, dates, currency, text
from app.utils import generate_row_id, sample_rows
from app.config import settings
from app.services.issues_service import detect_issues


def preview_fixes(spec: InputSpec) -> PreviewFixesResponse:
    """
    Preview proposed fixes without applying them

    Args:
        spec: Input specification

    Returns:
        PreviewFixesResponse with fix previews
    """
    df = load_frame(spec)

    # Detect issues first
    issues_response = detect_issues(spec)
    issues = issues_response.issues

    # Generate previews
    previews: List[FixPreview] = []
    max_rows = settings.preview_max_rows

    for issue in issues:
        if len(previews) >= max_rows:
            break

        if issue.row is None or issue.col is None:
            continue

        # Generate fix based on issue kind
        fix = generate_fix(df, issue)
        if fix:
            previews.append(fix)

    note = None
    if len(previews) >= max_rows and len(issues) > max_rows:
        note = f"Preview limited to {max_rows} fixes. Total issues: {len(issues)}"

    return PreviewFixesResponse(preview=previews, note=note)


def apply_fixes(spec: InputSpec) -> FixResult:
    """
    Apply fixes to dataset and optionally write clean file

    Args:
        spec: Input specification

    Returns:
        FixResult with applied/rejected counts and file path
    """
    df = load_frame(spec)

    # Detect issues
    issues_response = detect_issues(spec)
    issues = issues_response.issues

    # Apply fixes
    df_clean = df.copy()
    applied = 0
    rejected = 0

    for issue in issues:
        if issue.row is None or issue.col is None:
            continue

        # Apply fix
        success = apply_fix(df_clean, issue)
        if success:
            applied += 1
        else:
            rejected += 1

    # Write clean file to temp directory
    tmp_dir = os.path.join(settings.quality_tmp_dir, "clean")
    os.makedirs(tmp_dir, exist_ok=True)

    # Determine output filename
    if spec.file_path:
        base_name = os.path.basename(spec.file_path)
        clean_path = os.path.join(tmp_dir, f"clean_{base_name}")
    else:
        clean_path = os.path.join(tmp_dir, f"clean_data.{spec.file_type.value}")

    save_frame(df_clean, clean_path, spec.file_type)

    summary = {
        "total_issues": len(issues),
        "rows_affected": len(set(issue.row for issue in issues if issue.row is not None)),
        "original_rows": len(df),
        "clean_rows": len(df_clean),
    }

    return FixResult(
        applied=applied,
        rejected=rejected,
        file_clean_path=os.path.abspath(clean_path),
        summary=summary,
    )


def generate_fix(df: pd.DataFrame, issue) -> FixPreview | None:
    """Generate fix preview for an issue"""
    from app.schemas import IssueKind

    row_idx = issue.row
    col = issue.col
    current_value = str(df.iloc[row_idx][col]) if row_idx < len(df) else None

    if current_value is None:
        return None

    explanation = ""
    new_value = None

    if issue.kind == IssueKind.EMAIL_INVALID:
        # Can't auto-fix invalid emails reliably
        explanation = "Email format invalid - manual review required"
        new_value = None

    elif issue.kind == IssueKind.PHONE_INVALID:
        normalized = phone.normalize(current_value)
        new_value = normalized
        explanation = f"Normalized to E.164 format: {normalized}"

    elif issue.kind == IssueKind.DATE_FORMAT:
        normalized = dates.normalize(current_value)
        if normalized:
            new_value = normalized
            explanation = f"Converted to ISO format (YYYY-MM-DD)"
        else:
            explanation = "Could not parse date - manual review required"

    elif issue.kind == IssueKind.CURRENCY:
        value_numeric, code = currency.normalize(current_value)
        if value_numeric is not None:
            new_value = f"{value_numeric:.2f} {code}"
            explanation = f"Normalized to {code} format"
        else:
            explanation = "Could not parse currency - manual review required"

    elif issue.kind == IssueKind.PRICE_ZERO:
        explanation = "Zero price requires manual review"
        new_value = None

    elif issue.kind == IssueKind.ID_MISSING:
        generated_id = generate_row_id(row_idx, current_value)
        new_value = generated_id
        explanation = f"Generated ID: {generated_id}"

    elif issue.kind == IssueKind.DUPLICATE:
        explanation = f"Duplicate of row {issue.details.get('duplicate_of')} - consider removing"
        new_value = None

    else:
        # Generic
        explanation = f"Issue detected: {issue.kind.value}"
        new_value = None

    return FixPreview(
        row=row_idx,
        col=col,
        before=current_value,
        after=new_value,
        rule_id=None,
        explanation=explanation,
    )


def apply_fix(df: pd.DataFrame, issue) -> bool:
    """Apply a fix to the dataframe (in-place)"""
    from app.schemas import IssueKind

    row_idx = issue.row
    col = issue.col

    if row_idx >= len(df) or col not in df.columns:
        return False

    current_value = df.at[row_idx, col]

    try:
        if issue.kind == IssueKind.PHONE_INVALID:
            df.at[row_idx, col] = phone.normalize(str(current_value))
            return True

        elif issue.kind == IssueKind.DATE_FORMAT:
            normalized = dates.normalize(str(current_value))
            if normalized:
                df.at[row_idx, col] = normalized
                return True

        elif issue.kind == IssueKind.CURRENCY:
            value_numeric, code = currency.normalize(str(current_value))
            if value_numeric is not None:
                df.at[row_idx, col] = f"{value_numeric:.2f} {code}"
                return True

        elif issue.kind == IssueKind.ID_MISSING:
            df.at[row_idx, col] = generate_row_id(row_idx, str(current_value))
            return True

    except Exception:
        pass

    return False
