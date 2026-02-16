"""I/O utilities for reading and writing CSV/XLSX files"""
import base64
import os
from io import BytesIO
from pathlib import Path
from typing import Optional
import pandas as pd
from app.schemas import InputSpec, FileType


class IOError(Exception):
    """Custom exception for I/O operations"""

    pass


def load_frame(spec: InputSpec) -> pd.DataFrame:
    """
    Load a pandas DataFrame from InputSpec

    Args:
        spec: Input specification with file path or base64 content

    Returns:
        pandas DataFrame

    Raises:
        IOError: If file cannot be read or parsed
    """
    try:
        # Determine source: base64 or file path
        if spec.content_b64:
            # Decode base64 content
            try:
                file_bytes = base64.b64decode(spec.content_b64)
                file_obj = BytesIO(file_bytes)
            except Exception as e:
                raise IOError(f"Failed to decode base64 content: {e}")
        elif spec.file_path:
            # Read from file path
            if not os.path.exists(spec.file_path):
                raise IOError(f"File not found: {spec.file_path}")
            file_obj = spec.file_path
        else:
            raise IOError("Either file_path or content_b64 must be provided")

        # Read based on file type
        if spec.file_type == FileType.CSV:
            df = pd.read_csv(
                file_obj,
                delimiter=spec.delimiter or ",",
                encoding=spec.encoding or "utf-8",
                header=0 if spec.header else None,
            )
        elif spec.file_type == FileType.XLSX:
            df = pd.read_excel(
                file_obj,
                engine="openpyxl",
                header=0 if spec.header else None,
            )
        else:
            raise IOError(f"Unsupported file type: {spec.file_type}")

        # Apply column mapping if provided
        if spec.columns_map:
            df = df.rename(columns=spec.columns_map)

        # Normalize column names: strip and lowercase
        df.columns = df.columns.str.strip().str.lower()

        return df

    except IOError:
        raise
    except Exception as e:
        raise IOError(f"Failed to load dataframe: {e}")


def save_frame(
    df: pd.DataFrame,
    path: str,
    file_type: Optional[FileType] = None,
) -> str:
    """
    Save a pandas DataFrame to file

    Args:
        df: DataFrame to save
        path: Output file path
        file_type: File type (inferred from extension if not provided)

    Returns:
        Absolute path to saved file

    Raises:
        IOError: If file cannot be written
    """
    try:
        # Ensure parent directory exists
        Path(path).parent.mkdir(parents=True, exist_ok=True)

        # Infer file type from extension if not provided
        if not file_type:
            ext = Path(path).suffix.lower()
            if ext == ".csv":
                file_type = FileType.CSV
            elif ext in [".xlsx", ".xls"]:
                file_type = FileType.XLSX
            else:
                raise IOError(f"Cannot infer file type from extension: {ext}")

        # Write based on file type
        if file_type == FileType.CSV:
            df.to_csv(path, index=False, encoding="utf-8")
        elif file_type == FileType.XLSX:
            df.to_excel(path, index=False, engine="openpyxl")
        else:
            raise IOError(f"Unsupported file type: {file_type}")

        return os.path.abspath(path)

    except IOError:
        raise
    except Exception as e:
        raise IOError(f"Failed to save dataframe: {e}")


def get_file_type_from_path(path: str) -> FileType:
    """
    Determine file type from file path extension

    Args:
        path: File path

    Returns:
        FileType enum

    Raises:
        IOError: If extension is not supported
    """
    ext = Path(path).suffix.lower()
    if ext == ".csv":
        return FileType.CSV
    elif ext in [".xlsx", ".xls"]:
        return FileType.XLSX
    else:
        raise IOError(f"Unsupported file extension: {ext}")
