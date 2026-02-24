from fastapi import FastAPI
from src.api.routes import router
from src.config.settings import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        debug=settings.DEBUG,
    )

    app.include_router(router)
    return app

app = create_app()