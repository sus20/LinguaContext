import httpx

from fastapi import APIRouter, HTTPException

from app.schemas.word_explanation import WordExplanationRequest, WordExplanationResponse
from app.services.uai import ask_uai

router = APIRouter(prefix="/explain", tags=["explain"])

SYSTEM_PROMPT = (
    "You are a German language teacher. "
    "Explain what the word means IN THIS SENTENCE, in simple English."
)


@router.post("", response_model=WordExplanationResponse)
def explain_word_in_context(request: WordExplanationRequest):
    user_prompt = f"Word: {request.word}\nSentence: {request.sentence}"

    try:
        answer = ask_uai(SYSTEM_PROMPT, user_prompt)
    except httpx.HTTPStatusError as error:
        raise HTTPException(
            status_code=502,
            detail=f"u:ai said {error.response.status_code}: {error.response.text}",
        )
    except httpx.HTTPError as error:
        raise HTTPException(
            status_code=502, detail=f"u:ai not reachable: {error}")

    return {"explanation": answer}
