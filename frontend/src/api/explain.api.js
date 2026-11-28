import { API_BASE_URL } from "./client";

// ask the backend what a word means in its sentence
export async function explainWord(word, sentence) {
  const response = await fetch(`${API_BASE_URL}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, sentence }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Could not explain the word");
  }
  return data;
}
