"""Type definitions and enums"""
from enum import Enum


class IssueKind(str, Enum):
    """Types of data quality issues"""

    EMAIL_INVALID = "email_invalid"
    PHONE_INVALID = "phone_invalid"
    DUPLICATE = "duplicate"
    DATE_FORMAT = "date_format"
    CURRENCY = "currency"
    PRICE_ZERO = "price_zero"
    PRICE_NEGATIVE = "price_negative"
    ID_MISSING = "id_missing"
    NIF_CIF_BASIC = "nif_cif_basic"
    MISSING_VALUE = "missing_value"
    INCONSISTENT_CASE = "inconsistent_case"
    WHITESPACE = "whitespace"
    SPECIAL_CHARS = "special_chars"


class Severity(str, Enum):
    """Issue severity levels"""

    INFO = "info"
    WARN = "warn"
    ERROR = "error"


class FileType(str, Enum):
    """Supported file types"""

    CSV = "csv"
    XLSX = "xlsx"


class RuleKind(str, Enum):
    """Rule types for validation"""

    REGEX = "regex"
    NUMERIC = "numeric"
    DATE = "date"
    MAP = "map"
    PHONE_ES = "phone_es"
    EMAIL = "email"
    ENUM = "enum"
    REQUIRED = "required"
    UNIQUE = "unique"
    ID_NOT_EMPTY = "id_not_empty"
    PRICE_GT0 = "price_gt0"


class InferredType(str, Enum):
    """Inferred column types"""

    EMAIL = "email"
    PHONE = "phone"
    PHONE_ES = "phone_es"
    DATE = "date"
    NUMERIC = "numeric"
    CURRENCY = "currency"
    TEXT = "text"
    ID = "id"
    BOOLEAN = "boolean"
