import { useEffect, useState } from "react";
import "../pages/ReaderPage.css"


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

  return <div className="page-text">{text}</div>;
}

export default PdfPageText;
