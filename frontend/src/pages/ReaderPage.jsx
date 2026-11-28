import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PdfPage from "../components/PdfPage";
import { getDocument, getDocumentFileUrl } from "../api/documents.api";
import { explainWord } from "../api/explain.api";
import "./ReaderPage.css";
import { cleanWord } from "../utils/cleanWord";
import WordPopup from "../components/WordPopup";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function ReaderPage() {
  const navigate = useNavigate();
  const { documentId } = useParams();

  const [pdf, setPdf] = useState(null); // the opened PDF (null = not ready yet)
  const [popup, setPopup] = useState(null);
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

  async function handleMouseUp() {
    const selection = window.getSelection();
    const word = cleanWord(selection.toString());

    // a normal click (nothing selected closes the popup)
    if (word === "") {
      setPopup(null);
      return;
    }

    const line = selection.anchorNode?.parentElement?.textContent || word;

    // where is the word on the screen? -> put the popup under it.
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const x = Math.min(rect.left, window.innerWidth - 340); // not outside on the right
    const y = Math.min(rect.bottom + 8, window.innerHeight - 380); // not outside at the bottom

    // open the popup at once, with "Asking u:ai.."
    setPopup({ word, sentence: line, x, y, loading: true });

    // ask u:ai, then put the answer into the popup
    try {
      const result = await explainWord(word, line);
      setPopup((old) =>
        old && old.word === word ? { ...old, loading: false, result } : old,
      );
    } catch (error) {
      setPopup((old) =>
        old && old.word === word
          ? { ...old, loading: false, error: error.message }
          : old,
      );
    }
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
      {popup && <WordPopup popup={popup} onClose={() => setPopup(null)} />}
    </div>
  );
}

export default ReaderPage;
