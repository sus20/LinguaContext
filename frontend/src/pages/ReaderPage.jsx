import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PdfPage from "../components/PdfPage";
import { getDocument, getDocumentFileUrl } from "../api/documents.api";
import "./ReaderPage.css";
import { cleanWord } from "../utils/cleanWord";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function ReaderPage() {
  const navigate = useNavigate();
  const { documentId } = useParams();

  const [pdf, setPdf] = useState(null); // the opened PDF (null = not ready yet)
  const [documentInfo, setDocumentInfo] = useState(null);
  const [scale, setScale] = useState(1.5);
  const [error, setError] = useState(null);

  function zoomIn() {
    setScale((s) => Math.min(s + 0.25, 3)); // bigger, but max 300%
  }

  function zoomOut() {
    setScale((s) => Math.max(s - 0.25, 0.5)); // smaller, but min 50%
  }

  // load the PDF from the backend
  useEffect(() => {
    let stopped = false;

    async function loadDocument() {
      setPdf(null);
      setDocumentInfo(null);
      setError(null);

      try {
        // get document information
        const docInfo = await getDocument(documentId);

        // get pdf url
        const url = getDocumentFileUrl(documentId);

        const loadedPdf = await pdfjsLib.getDocument(url).promise; // pdf.js download it
        if (stopped) return;

        // save document information and PDF
        setDocumentInfo(docInfo);
        setPdf(loadedPdf);
      } catch (err) {
        if (!stopped) {
          console.error("Failed to load PDF:", err);
          setError("Unable to laod the PDF");
        }
      }
    }

    loadDocument();
    return () => {
      stopped = true;
    };
  }, [documentId]);

  function handleMouseUp() {
    const selected = cleanWord(window.getSelection().toString());
    if (selected === "") return; // nothing selected -> do nothing
    console.log("Selected:", selected);
  }

  return (
    <div className="reader">
      <header className="reader-top">
        <span className="reader-title">
          {documentInfo ? documentInfo.filename : "Loading.."}
        </span>

        <div className="reader-actions">
          <button className="zoom-btn" onClick={zoomOut}>
            −
          </button>
          <span className="zoom-value">{Math.round(scale * 100)}%</span>
          <button className="zoom-btn" onClick={zoomIn}>
            +
          </button>
        </div>
        <button className="close-btn" onClick={() => navigate("/library")}>
          ✕
        </button>
      </header>

      <div className="reader-pages" onMouseUp={handleMouseUp}>
        {pdf &&
          Array.from({ length: pdf.numPages }, (_, i) => (
            <PdfPage key={i} pdf={pdf} pageNumber={i + 1} scale={scale} />
          ))}
      </div>
    </div>
  );
}

export default ReaderPage;
