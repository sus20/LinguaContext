import json
import httpx

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from app.schemas.word_explanation import WordExplanationRequest, WordExplanationResponse
from app.services.uai import ask_uai

router = APIRouter(prefix="/explain", tags=["explain"])

AI_INSTRUCTIONS = """You are a German language teacher for English speakers.
You get a German word and the sentence it comes from.
Answer ONLY with JSON, no other text, in exactly this shape:
{"translation": "...", "word_type": "...", "explanation": "...", "sentence_translation": "..."}

- translation: the English meaning of the word IN THIS SENTENCE (1-3 words)
- word_type: noun, verb, adjective, adverb, ...
- explanation: one simple English sentence about what the word means in this context
- sentence_translation: the whole sentence in English"""


def parse_json_answer(answer: str) -> dict:
    """Take the JSON part out of the AI's answer."""
    start = answer.find("{")
    end = answer.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("no JSON found")
    return json.loads(answer[start:end + 1])


@router.post("", response_model=WordExplanationResponse)
def explain_word_in_context(request: WordExplanationRequest):
    """ask u:ai what a word means in its sentence."""
    user_prompt = f"Word: {request.word}\nSentence: {request.sentence}"

    # ask u:ai
    try:
        answer = ask_uai(AI_INSTRUCTIONS, user_prompt)
    except httpx.HTTPStatusError as error:
        raise HTTPException(
            status_code=502,
            detail=f"u:ai said {error.response.status_code}: {error.response.text}",
        )
    except httpx.HTTPError as error:
        raise HTTPException(
            status_code=502, detail=f"u:ai not reachable: {error}")

    try:
        data = parse_json_answer(answer)
        return WordExplanationResponse.model_validate(data)
    except (ValueError, ValidationError):
        raise HTTPException(
            status_code=502,
            detail="u:ai did not answer in the expected JSON format",
        )
