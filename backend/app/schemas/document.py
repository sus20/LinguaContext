from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentOut(BaseModel):
    """
    Pydantic schema for returning PDF document information to the frontend.

    Defines which document fields are included in the API response.
    Internal information, such as file paths and hashes, is not exposed.

    Fields:
        id: Unique ID of the document.
        filename: Original PDF filename displayed in the library.
        source_language: Original language of the PDF.
        target_language: Translation language.
        last_page: Last reading page, used to continue reading.
        created_at: Date and time when the document was uploaded.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    source_language: str
    target_language: str
    last_page: int
    created_at: datetime


class DocumentUploadResponse(BaseModel):
    message: str
    document: DocumentOut
