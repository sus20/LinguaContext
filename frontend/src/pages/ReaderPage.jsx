import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PdfPage from "../components/PdfPage";
import "./ReaderPage.css"

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function ReaderPage({ file }) {
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null); // the opened PDF (null = not ready yet)

  // open the PDF once
  useEffect(() => {
    if (!file) return;

    async function openPdf() {
      const data = await file.arrayBuffer();
      const loadedPdf = await pdfjsLib.getDocument({ data }).promise;
      setPdf(loadedPdf);
    }
    openPdf();
  }, [file]);

  return (
    <div className="reader">
      <header className="reader-top">
        <span className="reader-title">{file ? file.name : "No file"} </span>
        <button className="class-btn" onClick={() => navigate("/library")}>
          ✕
        </button>
      </header>

      <div className="reader-pages">
        {pdf &&
          Array.from({ length: pdf.numPages }, (_, i) => (
            <PdfPage key={i} pdf={pdf} pageNumber={i + 1} />
          ))}
      </div>
    </div>
  );
}

export default ReaderPage;
