"""Sampling utilities for reproducible data sampling"""
import pandas as pd
from typing import List, Any


def sample_values(
    series: pd.Series,
    n: int = 5,
    seed: int = 42,
    exclude_na: bool = True,
) -> List[Any]:
    """
    Sample values from a pandas Series

    Args:
        series: Input series
        n: Number of samples
        seed: Random seed for reproducibility
        exclude_na: Exclude NA/None values

    Returns:
        List of sampled values
    """
    if exclude_na:
        series = series.dropna()

    if len(series) == 0:
        return []

    # If fewer values than requested, return all unique values
    if len(series) <= n:
        return series.unique().tolist()

    # Sample with seed for reproducibility
    sampled = series.sample(n=min(n, len(series)), random_state=seed)
    return sampled.tolist()


def sample_rows(
    df: pd.DataFrame,
    n: int = 100,
    seed: int = 42,
) -> pd.DataFrame:
    """
    Sample rows from a DataFrame

    Args:
        df: Input DataFrame
        n: Number of rows to sample
        seed: Random seed for reproducibility

    Returns:
        Sampled DataFrame
    """
    if len(df) <= n:
        return df.copy()

    return df.sample(n=n, random_state=seed)
