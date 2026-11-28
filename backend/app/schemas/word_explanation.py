from pydantic import BaseModel


class WordExplanationRequest(BaseModel):
    word: str
    sentence: str


class WordExplanationResponse(BaseModel):
    translation: str
    word_type: str
    explanation: str
    sentence_translation: str
