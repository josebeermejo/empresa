"""Infer schema route"""
from fastapi import APIRouter, HTTPException
from app.schemas import InputSpec, InferResult
from app.services import infer_service
from app.io_utils import IOError

router = APIRouter()


@router.post("/infer", response_model=InferResult)
async def infer(spec: InputSpec):
    """
    Infer schema and data types from a dataset

    Args:
        spec: Input specification (file_path or content_b64)

    Returns:
        InferResult with column information and KPIs
    """
    try:
        result = infer_service.infer_schema(spec)
        return result
    except IOError as e:
        raise HTTPException(status_code=422, detail={"code": "PARSE_ERROR", "message": str(e)})
    except Exception as e:
        raise HTTPException(
            status_code=500, detail={"code": "INTERNAL_ERROR", "message": str(e)}
        )
