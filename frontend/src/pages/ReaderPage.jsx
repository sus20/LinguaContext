import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PdfPage from "../components/PdfPage";
import "./ReaderPage.css";
import { cleanWord } from "../utils/cleanWord";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function ReaderPage({ file }) {
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null); // the opened PDF (null = not ready yet)
  const [scale, setScale] = useState(1.5);

  function zoomIn() {
    setScale((s) => Math.min(s + 0.25, 3)); // bigger, but max 300%
  }

  function zoomOut() {
    setScale((s) => Math.max(s - 0.25, 0.5)); // smaller, but min 50%
  }

  // open the PDF once
  useEffect(() => {
    if (!file) return;
    let stopped = false;

    async function openPdf() {
      const data = await file.arrayBuffer();
      const loadedPdf = await pdfjsLib.getDocument({ data }).promise;
      if (stopped) return;
      setPdf(loadedPdf);
    }
    openPdf();
    return () => {
      stopped = true;
    };
  }, [file]);

  function handleMouseUp() {
    const selected = cleanWord(window.getSelection().toString());
    if (selected === "") return; // nothing selected -> do nothing
    console.log("Selected:", selected);
  }

  return (
    <div className="reader">
      <header className="reader-top">
        <span className="reader-title">{file ? file.name : "No file"} </span>

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
