from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    
    # Supabase
    supabase_url: str
    supabase_key: str
    
    # AI APIs
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    
    # MCP Server
    mcp_server_url: str = "http://localhost:3000"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # Application
    environment: str = "development"
    log_level: str = "INFO"
    
    # API
    api_title: str = "WhatsApp Digest API"
    api_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    
    # CORS
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
