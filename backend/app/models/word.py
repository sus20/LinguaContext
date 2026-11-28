from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Word(Base):
    __tablename__ = "words"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # Word and its context from the PDF
    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE")
    )

    # Access the related Document object
    document: Mapped["Document"] = relationship()

    word: Mapped[str] = mapped_column(String(100))
    context_sentence: Mapped[str] = mapped_column(Text)
    page_number: Mapped[int] = mapped_column(Integer)

    # AI translation and explanation
    translation: Mapped[str | None] = mapped_column(String(200), nullable=True)
    word_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    sentence_translation: Mapped[str |
                                 None] = mapped_column(Text, nullable=True)

    # Flashcard learning progress
    leitner_box: Mapped[int] = mapped_column(Integer, default=1)

    next_review_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Get the filename of the related document
    @property
    def document_filename(self) -> str:
        return self.document.filename
