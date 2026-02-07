import os
from dataclasses import dataclass


@dataclass
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./travel_decision.db")
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    otp_expire_minutes: int = int(os.getenv("OTP_EXPIRE_MINUTES", "15"))
    environment: str = os.getenv("ENVIRONMENT", "development")

    def __post_init__(self):
        if self.database_url and self.database_url.startswith("postgres://"):
            self.database_url = self.database_url.replace("postgres://", "postgresql://", 1)


settings = Settings()
