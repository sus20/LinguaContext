import os
from pathlib import Path

import httpx
from dotenv import load_dotenv

# load the u:ai settings from backend/dev.env
BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / "dev.env")

UAI_BASE_URL = os.environ["UAI_BASE_URL"]
UAI_MODEL = os.environ.get("UAI_MODEL", "gpt-5-mini")
HEADERS = {
    "X-Client-ID": os.environ["UAI_CLIENT_ID"],
    "X-Client-Secret": os.environ["UAI_CLIENT_SECRET"],
    "Content-Type": "application/json"
}


def ask_uai(system_prompt: str, user_prompt: str) -> str:
    """send one questions to u_ai and return the answer text."""

    body = {
        "model": UAI_MODEL,
        "messages": [
            {
                "role": "user",
                "content": f"{system_prompt}\n\n{user_prompt}"
            }
        ],
        "maxCompletionTokens": 1000,
        "reasoningEffort": "low"
    }

    print("SENDING TO u:ai:", body)

    response = httpx.post(
        f"{UAI_BASE_URL}/api/v1/llm/chat",
        headers=HEADERS,
        json=body,
        timeout=30,
    )

    response.raise_for_status()
    print("UAI RESPONSE:", response.json())

    return response.json()["data"]["content"]
