"""Fixes routes (preview and apply)"""
from fastapi import APIRouter, HTTPException
from app.schemas import InputSpec, FixResult, PreviewFixesResponse
from app.services import fixes_service
from app.io_utils import IOError

router = APIRouter()


@router.post("/preview_fixes", response_model=PreviewFixesResponse)
async def preview_fixes(spec: InputSpec):
    """
    Preview proposed fixes without applying them

    Args:
        spec: Input specification (file_path or content_b64)

    Returns:
        PreviewFixesResponse with fix previews
    """
    try:
        result = fixes_service.preview_fixes(spec)
        return result
    except IOError as e:
        raise HTTPException(status_code=422, detail={"code": "PARSE_ERROR", "message": str(e)})
    except Exception as e:
        raise HTTPException(
            status_code=500, detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )


@router.post("/apply_fixes", response_model=FixResult)
async def apply_fixes(spec: InputSpec):
    """
    Apply fixes to dataset and generate clean file

    Args:
        spec: Input specification (file_path or content_b64)

    Returns:
        FixResult with applied/rejected counts and clean file path
    """
    try:
        result = fixes_service.apply_fixes(spec)
        return result
    except IOError as e:
        raise HTTPException(status_code=422, detail={"code": "PARSE_ERROR", "message": str(e)})
    except Exception as e:
        raise HTTPException(
            status_code=500, detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )
