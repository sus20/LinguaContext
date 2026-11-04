from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Document(Base):
    """
        Database model for storing uploaded PDF documents.

        Each row represents one uploaded PDF.

        Columns:
            id: Unique ID of the document, used to open it (e.g. /read/7).
            filename: Original PDF filename displayed in the library.
            file_path: Location where the PDF is stored on disk.
            file_hash: Unique fingerprint to prevent duplicate uploads.
            source_language: Original language of the PDF (default: German).
            target_language: Translation language (default: English).
            last_page: Last reading page, used to continue reading.
            created_at: Date and time when the document was uploaded.
    """

    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    filename: Mapped[str] = mapped_column(String(255))
    file_path: Mapped[str] = mapped_column(String(500))
    file_hash: Mapped[str] = mapped_column(String(64), unique=True)
    source_language: Mapped[str] = mapped_column(String(10), default="de")
    target_language: Mapped[str] = mapped_column(String(10), default="en")
    last_page: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()

    )
