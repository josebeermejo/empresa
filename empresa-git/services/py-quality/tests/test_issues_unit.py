"""Test issues detection"""
import pytest
from httpx import AsyncClient
from app.main import app
from app.schemas import FileType, IssueKind


@pytest.mark.asyncio
async def test_detect_issues_endpoint(sample_csv_dirty):
    """Test POST /detect_issues with dirty CSV"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/detect_issues",
            json={
                "file_path": sample_csv_dirty,
                "file_type": FileType.CSV.value,
            },
        )

    assert response.status_code == 200
    data = response.json()

    # Check structure
    assert "issues" in data
    assert "summary" in data

    issues = data["issues"]
    assert len(issues) > 0

    # Check for expected issue types
    issue_kinds = [issue["kind"] for issue in issues]

    # Should detect email issues
    assert IssueKind.EMAIL_INVALID.value in issue_kinds

    # Should detect phone issues
    assert IssueKind.PHONE_INVALID.value in issue_kinds

    # Should detect price issues
    assert (
        IssueKind.PRICE_ZERO.value in issue_kinds or IssueKind.PRICE_NEGATIVE.value in issue_kinds
    )

    # Should detect ID missing
    assert IssueKind.ID_MISSING.value in issue_kinds

    # Should detect duplicates
    assert IssueKind.DUPLICATE.value in issue_kinds

    # Check summary
    summary = data["summary"]
    assert summary["total_issues"] > 0
    assert "by_kind" in summary
    assert "by_severity" in summary
