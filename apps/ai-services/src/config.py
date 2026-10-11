from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_service_role_key: str
    
    # Google Gemini
    google_api_key: str
    gemini_model: str = "gemini-1.5-pro"
    gemini_embedding_model: str = "models/text-embedding-004"
    
    # HeyGen
    heygen_api_key: Optional[str] = None
    heygen_avatar_id: Optional[str] = None
    heygen_voice_id: Optional[str] = None
    
    # App
    environment: str = "development"
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()