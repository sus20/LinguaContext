from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


# request schema for saving a new word
class WordCreate(BaseModel):
    document_id: int
    word: str = Field(min_length=1, max_length=100)
    context_sentence: str
    page_number: int = Field(ge=1)
    translation: str | None = None
    word_type: str | None = None
    explanation: str | None = None
    sentence_translation: str | None = None

    # check if the word appears in the context sentence
    @model_validator(mode="after")
    def word_must_be_in_sentence(self):
        if self.word.casefold() not in self.context_sentence.casefold():
            raise ValueError("The word must appear in the context sentence")
        return self


# response schema for a saved word
class WordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    document_id: int
    document_filename: str
    word: str
    context_sentence: str
    page_number: int
    translation: str | None
    word_type: str | None
    explanation: str | None
    sentence_translation: str | None
    leitner_box: int
    next_review_at: datetime
    created_at: datetime
