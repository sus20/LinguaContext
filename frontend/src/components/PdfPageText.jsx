import { useEffect, useState } from "react";
import "./PdfPageText.css";

// TEXT VIEW: Extracts PDF text and displays it as HTML.
// Users can select and copy words, but the original PDF layout is lost.
function PdfPageText({ pdf, pageNumber }) {
  const [text, setText] = useState("");

  useEffect(() => {
    async function loadText() {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      // glue the small pieces together: hasEOL = "end of line"
      const pageText = content.items
        .map((item) => item.str + (item.hasEOL ? "\n" : " "))
        .join("");
      setText(pageText);
    }
    loadText();
  }, [pdf, pageNumber]);

  // handles word clicks by removing surrounding punctuation and logging the cleaned word.
  function handleWordClick(rawWord) {
    //remove punctuation and symbols from te beginning and end.
    const word = rawWord.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

    // ignore the click if no letters or numbers remain
    if (word === "") return;
    console.log("Clicked word:", word);
  }

  // cut the text into words AND spaces (we keep the spaces and line breaks)
  const parts = text.split(/(\s+)/);

  return (
    <div className="page-text">
      {parts.map((part, index) =>
        part.trim() === "" ? (
          part
        ) : (
          <span
            key={index}
            className="word"
            onClick={() => handleWordClick(part)}
          >
            {part}{" "}
          </span>
        ),
      )}
    </div>
  );
}

export default PdfPageText;
