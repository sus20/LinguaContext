import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function ReaderPage({ file }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null); // a handle to the "canvas" below

  useEffect(() => {
    if (!file) return;
    let stopped = false;

    async function drawFirstPage() {
      const data = await file.arrayBuffer(); // read the file
      const pdf = await pdfjsLib.getDocument({ data }).promise; // open it
      const page = await pdf.getPage(1); // take page 1

      if (stopped) return;
      const viewport = page.getViewport({ scale: 1.5 }); // size of the pages
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: canvas.getContext("2d"), // paint it
        viewport,
      }).promise;
    }

    drawFirstPage();

    return () => {
      stopped = true;
    };
  }, [file]);

  return (
    <div>
      <button onClick={() => navigate("/library")}>X</button>
      <h1>{file ? file.name : "No file"}</h1>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default ReaderPage;
