"""Test fixtures and shared utilities"""
import pytest
import pandas as pd
import os
import tempfile


@pytest.fixture
def sample_csv_dirty():
    """Create a dirty CSV file for testing"""
    data = {
        "id": ["1", "", "3", "4", "5"],
        "nombre": ["Juan", "María", "juan", "Pedro", "Luis"],
        "email": ["juan@example.com", "maria@", "juan@example.com", "pedro@test.com", "luis@"],
        "telefono": ["600123456", "+34655987654", "600234567", "700", "600123456"],
        "precio": [10.50, 0, -5.25, 20.75, 15.00],
        "fecha": ["15/01/2024", "2024-01-16", "15-01-2024", "2024/01/17", "16/01/2024"],
    }

    df = pd.DataFrame(data)

    # Create temp file
    temp_file = tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=False)
    df.to_csv(temp_file.name, index=False)
    temp_file.close()

    yield temp_file.name

    # Cleanup
    os.unlink(temp_file.name)
