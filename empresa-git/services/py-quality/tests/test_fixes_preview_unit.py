"""Test fixes preview"""
import pytest
from httpx import AsyncClient
from app.main import app
from app.schemas import FileType


@pytest.mark.asyncio
async def test_preview_fixes_endpoint(sample_csv_dirty):
    """Test POST /preview_fixes"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/preview_fixes",
            json={
                "file_path": sample_csv_dirty,
                "file_type": FileType.CSV.value,
            },
        )

    assert response.status_code == 200
    data = response.json()

    # Check structure
    assert "preview" in data

    previews = data["preview"]
    assert len(previews) > 0

    # Check preview structure
    first_preview = previews[0]
    assert "row" in first_preview
    assert "col" in first_preview
    assert "before" in first_preview
    assert "after" in first_preview or first_preview["after"] is None
    assert "explanation" in first_preview

    # Verify some fixes are proposed
    fixes_with_after = [p for p in previews if p["after"] is not None]
    assert len(fixes_with_after) > 0
