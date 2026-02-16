"""Health and version routes"""
from fastapi import APIRouter
from app.schemas import HealthResponse, VersionResponse
from app import __version__
import subprocess

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    return HealthResponse(status="ok")


@router.get("/version", response_model=VersionResponse)
async def version():
    """Version information endpoint"""
    # Try to get git commit hash
    commit = None
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True,
            text=True,
            timeout=1,
        )
        if result.returncode == 0:
            commit = result.stdout.strip()
    except Exception:
        pass

    return VersionResponse(version=__version__, commit=commit)
