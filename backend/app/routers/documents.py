import hashlib
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Response, status, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Document
from app.schemas import DocumentOut, DocumentUploadResponse

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def validate_pdf(filename: str | None, content: bytes) -> str:
    """check that the uploaded file is a PDF."""

    if not filename or not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowd"
        )

    if not content.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file"
        )
    return filename


def calcualte_file_hash(content: bytes) -> str:
    """Create a unique fingerpring for the file. """

    return hashlib.sha256(content).hexdigest()


def find_existing_document(db: Session, file_hash: str):
    """Find a document with the same file hash."""

    return db.query(Document).filter(
        Document.file_hash == file_hash
    ).first()


def save_pdf(content: bytes, file_hash: str) -> Path:
    """Save the PDF file inside the upload directory."""

    saved_path = UPLOAD_DIR / f"{file_hash}.pdf"
    saved_path.write_bytes(content)

    return saved_path


def save_document_to_db(db: Session, filename: str, saved_path: Path, file_hash: str) -> Document:
    """Save document informaiton is PostgresSQL."""

    document = Document(
        filename=filename,
        file_path=saved_path.name,
        file_hash=file_hash
    )
    try:
        db.add(document)
        db.commit()
        db.refresh(document)
    except Exception:
        db.rollback()
        raise

    return document


@router.post(
    "",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED
)
async def upload_document(
        response: Response,
        file: UploadFile = File(...),
        db: Session = Depends(get_db)):
    """Upload a PDF and store its information."""

    content = await file.read()
    filename = validate_pdf(file.filename, content)
    file_hash = calcualte_file_hash(content)
    existing = find_existing_document(db, file_hash)

    if existing:
        response.status_code = status.HTTP_200_OK
        return {
            "message": "PDF already uploaded",
            "document": existing
        }

    saved_path = save_pdf(content, file_hash)
    saved_document = save_document_to_db(db, filename, saved_path, file_hash)

    return {
        "message": "PDF uploaded sucessfully",
        "document": saved_document
    }


@router.get("", response_model=list[DocumentOut])
def get_documents(db: Session = Depends(get_db)):
    """Return all uploaded documents, newest first."""

    return db.query(Document).order_by(Document.created_at.desc()).all()


def find_document_by_id(db: Session, document_id: int) -> Document:
    """find one document by its id , or return 404."""

    document = db.get(Document, document_id)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    return document


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Return information about one PDF."""

    return find_document_by_id(db, document_id)


@router.get("/{document_id}/file")
def get_document_file(document_id: int, db: Session = Depends(get_db)):
    """Return the PDF file for the reader"""

    document = find_document_by_id(db, document_id)
    file_path = UPLOAD_DIR / document.file_path

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="PDF file not found on disk"
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=document.filename,
        content_disposition_type="inline"
    )
