"""Data Transfer Objects (DTOs) for API contracts"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from .types import IssueKind, Severity, FileType, RuleKind, InferredType


class RuleSpec(BaseModel):
    """Specification for a data quality rule"""

    id: Optional[str] = None
    name: str
    kind: RuleKind
    spec: Dict[str, Any] = Field(default_factory=dict)


class InputSpec(BaseModel):
    """Input specification for data quality operations"""

    file_path: Optional[str] = None
    content_b64: Optional[str] = None
    file_type: FileType
    delimiter: Optional[str] = ","
    encoding: Optional[str] = "utf-8"
    header: bool = True
    columns_map: Optional[Dict[str, str]] = None
    rules: Optional[List[RuleSpec]] = None

    def model_post_init(self, __context: Any) -> None:
        """Validate that either file_path or content_b64 is provided"""
        if not self.file_path and not self.content_b64:
            raise ValueError("Either file_path or content_b64 must be provided")


class Issue(BaseModel):
    """Data quality issue"""

    kind: IssueKind
    severity: Severity
    row: Optional[int] = None
    col: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)


class FixPreview(BaseModel):
    """Preview of a proposed fix"""

    row: int
    col: str
    before: Optional[str] = None
    after: Optional[str] = None
    rule_id: Optional[str] = None
    explanation: str


class FixResult(BaseModel):
    """Result of applying fixes"""

    applied: int
    rejected: int
    file_clean_path: Optional[str] = None
    summary: Dict[str, Any] = Field(default_factory=dict)


class ColumnInfo(BaseModel):
    """Information about a column"""

    name: str
    inferred_type: InferredType
    confidence: float = Field(ge=0.0, le=1.0)
    sample: List[Any] = Field(default_factory=list)
    missing_pct: float = Field(ge=0.0, le=100.0)
    unique_count: int


class InferResult(BaseModel):
    """Result of schema inference"""

    columns: List[ColumnInfo]
    kpis: Dict[str, Any] = Field(default_factory=dict)
    warnings: List[str] = Field(default_factory=list)


class DetectIssuesResponse(BaseModel):
    """Response for detect_issues endpoint"""

    issues: List[Issue]
    summary: Dict[str, Any] = Field(default_factory=dict)


class PreviewFixesResponse(BaseModel):
    """Response for preview_fixes endpoint"""

    preview: List[FixPreview]
    note: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response"""

    status: str = "ok"


class VersionResponse(BaseModel):
    """Version information response"""

    version: str
    commit: Optional[str] = None
