"""Test apply fixes integration"""
import pytest
import os
from httpx import AsyncClient
from app.main import app
from app.schemas import FileType


@pytest.mark.asyncio
async def test_apply_fixes_endpoint(sample_csv_dirty):
    """Test POST /apply_fixes - full integration"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/apply_fixes",
            json={
                "file_path": sample_csv_dirty,
                "file_type": FileType.CSV.value,
            },
        )

    assert response.status_code == 200
    data = response.json()

    # Check structure
    assert "applied" in data
    assert "rejected" in data
    assert "file_clean_path" in data
    assert "summary" in data

    # Verify some fixes were applied
    assert data["applied"] > 0

    # Verify clean file was created
    clean_path = data["file_clean_path"]
    assert clean_path is not None
    assert os.path.exists(clean_path)

    # Check summary
    summary = data["summary"]
    assert "total_issues" in summary
    assert "original_rows" in summary
    assert "clean_rows" in summary

    # Cleanup
    if clean_path and os.path.exists(clean_path):
        os.unlink(clean_path)
