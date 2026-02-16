"""Schema inference service"""
import re
import pandas as pd
from typing import List, Dict, Any
from app.schemas import InferResult, ColumnInfo, InferredType, InputSpec
from app.io_utils import load_frame
from app.utils import sample_values


def infer_schema(spec: InputSpec) -> InferResult:
    """
    Infer schema and data types from a dataset

    Args:
        spec: Input specification

    Returns:
        InferResult with column information and KPIs
    """
    df = load_frame(spec)

    columns_info: List[ColumnInfo] = []
    total_rows = len(df)

    for col in df.columns:
        column_info = infer_column(df, col, total_rows)
        columns_info.append(column_info)

    # Calculate KPIs
    kpis = calculate_kpis(df)

    # Generate warnings
    warnings = []
    if kpis.get("empties_pct", 0) > 10:
        warnings.append(f"High percentage of empty cells: {kpis['empties_pct']:.1f}%")
    if kpis.get("duplicates_suspected", 0) > 0:
        warnings.append(f"Suspected duplicates: {kpis['duplicates_suspected']}")

    return InferResult(columns=columns_info, kpis=kpis, warnings=warnings)


def infer_column(df: pd.DataFrame, column: str, total_rows: int) -> ColumnInfo:
    """
    Infer type and statistics for a single column

    Args:
        df: DataFrame
        column: Column name
        total_rows: Total number of rows

    Returns:
        ColumnInfo object
    """
    series = df[column]

    # Missing percentage
    missing_count = series.isna().sum()
    missing_pct = (missing_count / total_rows * 100) if total_rows > 0 else 0

    # Unique count
    unique_count = series.nunique()

    # Sample values
    samples = sample_values(series, n=5, exclude_na=True)

    # Infer type
    inferred_type, confidence = infer_type(series)

    return ColumnInfo(
        name=column,
        inferred_type=inferred_type,
        confidence=confidence,
        sample=samples,
        missing_pct=round(missing_pct, 2),
        unique_count=unique_count,
    )


def infer_type(series: pd.Series) -> tuple[InferredType, float]:
    """
    Infer data type from a series

    Args:
        series: pandas Series

    Returns:
        Tuple of (InferredType, confidence)
    """
    # Remove nulls
    non_null = series.dropna()

    if len(non_null) == 0:
        return InferredType.TEXT, 0.0

    # Sample for type detection
    sample = non_null.sample(n=min(50, len(non_null)), random_state=42)

    # Check for email
    email_pattern = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    email_matches = sum(1 for val in sample if email_pattern.match(str(val)))
    if email_matches / len(sample) > 0.7:
        return InferredType.EMAIL, round(email_matches / len(sample), 2)

    # Check for phone
    phone_pattern = re.compile(r"^[\+\d\s\-\(\)]{8,15}$")
    phone_matches = sum(1 for val in sample if phone_pattern.match(str(val).strip()))
    if phone_matches / len(sample) > 0.7:
        # Check if Spanish
        spanish_phone = sum(
            1 for val in sample if "+34" in str(val) or len(re.sub(r"[^\d]", "", str(val))) == 9
        )
        if spanish_phone / len(sample) > 0.5:
            return InferredType.PHONE_ES, round(phone_matches / len(sample), 2)
        return InferredType.PHONE, round(phone_matches / len(sample), 2)

    # Check for date
    date_indicators = ["fecha", "date", "born", "created", "updated"]
    if any(indicator in series.name.lower() for indicator in date_indicators):
        return InferredType.DATE, 0.8

    # Check for currency
    currency_pattern = re.compile(r"[$€£¥]|EUR|USD|GBP")
    currency_matches = sum(1 for val in sample if currency_pattern.search(str(val)))
    if currency_matches / len(sample) > 0.5:
        return InferredType.CURRENCY, round(currency_matches / len(sample), 2)

    # Check for numeric
    try:
        pd.to_numeric(sample)
        return InferredType.NUMERIC, 0.95
    except (ValueError, TypeError):
        pass

    # Check for boolean
    bool_values = {"true", "false", "yes", "no", "1", "0", "si", "no", "sí"}
    bool_matches = sum(1 for val in sample if str(val).lower() in bool_values)
    if bool_matches / len(sample) > 0.8:
        return InferredType.BOOLEAN, round(bool_matches / len(sample), 2)

    # Check for ID
    id_indicators = ["id", "sku", "code", "codigo", "código"]
    if any(indicator in series.name.lower() for indicator in id_indicators):
        return InferredType.ID, 0.7

    # Default to text
    return InferredType.TEXT, 0.5


def calculate_kpis(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Calculate key performance indicators

    Args:
        df: DataFrame

    Returns:
        Dictionary of KPIs
    """
    total_cells = df.size
    empty_cells = df.isna().sum().sum()
    empties_pct = (empty_cells / total_cells * 100) if total_cells > 0 else 0

    # Rough duplicate estimate (exact duplicates only)
    duplicates_suspected = len(df) - len(df.drop_duplicates())

    kpis = {
        "rows": len(df),
        "cols": len(df.columns),
        "empties_pct": round(empties_pct, 2),
        "duplicates_suspected": duplicates_suspected,
    }

    # Count zero prices if precio/price column exists
    price_cols = [col for col in df.columns if "precio" in col.lower() or "price" in col.lower()]
    if price_cols:
        price_zeros = 0
        for col in price_cols:
            try:
                price_zeros += (pd.to_numeric(df[col], errors="coerce") == 0).sum()
            except:
                pass
        kpis["price_zeros"] = price_zeros

    return kpis
