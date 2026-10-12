from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "mindframe-engine"
    version: str = "0.0.1"
    cors_origins: str = "http://localhost:3000"

    llm_provider: str = "gemini"
    supabase_url: str | None = None
    supabase_service_key: str | None = None

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
