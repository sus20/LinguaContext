from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Document, Word
from app.schemas import WordCreate


def get_document(db: Session, document_id: int) -> Document:
    """Find the document or raise an error."""

    document = db.get(Document, document_id)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document


def find_existing_word(db: Session, data: WordCreate) -> Word | None:
    """Find a word that is already saved for this document."""

    return db.query(Word).filter(
        Word.document_id == data.document_id,
        Word.word == data.word,
        Word.context_sentence == data.context_sentence,
    ).first()


def create_word(db: Session, data: WordCreate) -> Word:
    """Create and save a new word in the database."""

    word = Word(**data.model_dump())

    try:
        db.add(word)
        db.commit()
        db.refresh(word)
    except Exception:
        db.rollback()
        raise

    return word
