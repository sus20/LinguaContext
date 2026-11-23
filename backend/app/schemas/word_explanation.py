from pydantic import BaseModel


class WordExplanationRequest(BaseModel):
    word: str
    sentence: str


class WordExplanationResponse(BaseModel):
    explanation: str
