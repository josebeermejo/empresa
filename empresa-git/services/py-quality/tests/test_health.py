"""Test health endpoints"""
import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health():
    """Test GET /health"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_version():
    """Test GET /version"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/version")

    assert response.status_code == 200
    data = response.json()
    assert "version" in data
    assert data["version"] ==  "0.1.0"
