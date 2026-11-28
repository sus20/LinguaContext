from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import WordCreate, WordOut
from app.routers.documents import UPLOAD_DIR
from app.services.pdf_validation import validate_page, validate_sentence
from app.services.word_operations import (
    get_document,
    find_existing_word,
    create_word,
)

router = APIRouter(prefix="/words", tags=["words"])


@router.post("", response_model=WordOut, status_code=status.HTTP_201_CREATED)
def save_word(data: WordCreate, response: Response, db: Session = Depends(get_db)):
    """Save a word with its context and AI explanation."""

    document = get_document(db, data.document_id)

    pdf_path = UPLOAD_DIR / document.file_path
    validate_page(pdf_path, data.page_number)
    validate_sentence(pdf_path, data.page_number, data.context_sentence)

    existing = find_existing_word(db, data)

    if existing:
        response.status_code = status.HTTP_200_OK
        return existing

    return create_word(db, data)
