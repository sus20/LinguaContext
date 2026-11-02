// Removes punctuation at the START and END of a word or phrase.
// Keeps letters and numbers from all languages (also ä ö ü ß).
// Example: "(SFT)" → "SFT",  "„Klasse“" → "Klasse",  "fine-tuning" → "fine-tuning"
export function cleanWord(text) {
  return text.trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}
