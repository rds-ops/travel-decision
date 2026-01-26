import os
from dataclasses import dataclass


@dataclass
class Settings:
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql+psycopg2://postgres:postgres@db:5432/travel_decision"
    )
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    otp_expire_minutes: int = int(os.getenv("OTP_EXPIRE_MINUTES", "15"))
    environment: str = os.getenv("ENVIRONMENT", "development")


settings = Settings()
