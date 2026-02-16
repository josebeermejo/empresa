"""Issues detection routes"""
from fastapi import APIRouter, HTTPException
from app.schemas import InputSpec, DetectIssuesResponse
from app.services import issues_service
from app.io_utils import IOError

router = APIRouter()


@router.post("/detect_issues", response_model=DetectIssuesResponse)
async def detect_issues(spec: InputSpec):
    """
    Detect data quality issues in a dataset

    Args:
        spec: Input specification (file_path or content_b64)

    Returns:
        DetectIssuesResponse with issues and summary
    """
    try:
        result = issues_service.detect_issues(spec)
        return result
    except IOError as e:
        raise HTTPException(status_code=422, detail={"code": "PARSE_ERROR", "message": str(e)})
    except Exception as e:
        raise HTTPException(
            status_code=500, detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )
