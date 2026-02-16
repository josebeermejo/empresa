"""Configuration for Python Quality Service"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Server
    quality_port: int = 8000
    quality_host: str = "0.0.0.0"

    # Storage
    quality_tmp_dir: str = "./.quality_tmp"

    # Phone validation
    phone_cc: str = "+34"
    phone_length: int = 9

    # Duplicates detection
    dup_threshold: float = 0.90
    dup_key_columns: str = "nombre,email"

    # Date normalization
    date_output_fmt: str = "YYYY-MM-DD"

    # Preview limits
    preview_max_rows: int = 100

    # Logging
    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def dup_key_columns_list(self) -> List[str]:
        """Parse comma-separated columns into list"""
        return [col.strip() for col in self.dup_key_columns.split(",")]


# Singleton settings instance
settings = Settings()
