import { API_BASE_URL } from "./client";

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Document upload failed: ${response.status}`);
  }

  return response.json();
}

export async function getDocument(documentId) {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.status}`);
  }

  return response.json();
}

export function getDocumentFileUrl(documentId) {
  return `${API_BASE_URL}/documents/${documentId}/file`;
}
