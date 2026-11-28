from pathlib import Path

import pymupdf
import unicodedata
from fastapi import HTTPException


def get_page_count(pdf_path: Path) -> int:
    """Return the total number of pages in the PDF."""

    with pymupdf.open(pdf_path) as pdf:
        return pdf.page_count


def validate_page(pdf_path: Path, page_number: int) -> None:
    """Check if the page exists in the PDF."""

    page_count = get_page_count(pdf_path)

    if not 1 <= page_number <= page_count:
        raise HTTPException(
            status_code=422,
            detail=f"Page {page_number} does not exist "
                   f"(the PDF has {page_count} pages)"
        )


def normalize_text(text: str) -> str:
    """Convert text to lowercase and keep only letters and numbers."""

    text = unicodedata.normalize("NFKC", text)
    text = text.casefold()

    normalized_text = ""

    for char in text:
        if char.isalnum():
            normalized_text += char

    return normalized_text


def validate_sentence(pdf_path: Path, page_number: int, sentence: str) -> None:
    """Check if the sentence is on this page (or continues on the next page)."""

    with pymupdf.open(pdf_path) as pdf:
        page_text = pdf[page_number - 1].get_text()

        # a sentence can start on this page and end on the next one
        if page_number < pdf.page_count:
            page_text += pdf[page_number].get_text()

    if normalize_text(sentence) not in normalize_text(page_text):
        raise HTTPException(
            status_code=422,
            detail="The sentence was not found on this page of the PDF"
        )
