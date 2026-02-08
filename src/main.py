"""Main application entry point."""

import logging
import sys
from pathlib import Path

# Add src to path for development
sys.path.append(str(Path(__file__).parent.parent))

from src.config.settings import settings
from src.utils.logger import setup_logging
from src.api.app import app  # <-- import FastAPI app
import uvicorn

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


def main():
    """Main application function."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.VERSION}")
    logger.info(f"Environment: {settings.APP_ENV}")

    # Start FastAPI server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.PORT,
    )


if __name__ == "__main__":
    main()