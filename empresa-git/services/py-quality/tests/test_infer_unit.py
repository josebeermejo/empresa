"""Test infer service"""
import pytest
from httpx import AsyncClient
from app.main import app
from app.schemas import FileType


@pytest.mark.asyncio
async def test_infer_endpoint(sample_csv_dirty):
    """Test POST /infer with dirty CSV"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/infer",
            json={
                "file_path": sample_csv_dirty,
                "file_type": FileType.CSV.value,
            },
        )

    assert response.status_code == 200
    data = response.json()

    # Check structure
    assert "columns" in data
    assert "kpis" in data
    assert "warnings" in data

    # Check columns
    columns = data["columns"]
    assert len(columns) == 6  # id, nombre, email, telefono, precio, fecha

    # Find email column
    email_col = next((c for c in columns if c["name"] == "email"), None)
    assert email_col is not None
    assert email_col["inferred_type"] == "email"
    assert email_col["confidence"] > 0.5

    # Check KPIs
    kpis = data["kpis"]
    assert kpis["rows"] == 5
    assert kpis["cols"] == 6
