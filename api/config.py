from pydantic import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str
    DB_URL: str

    class Config:
        env_file = ".env"


settings = Settings()
