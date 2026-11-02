import { useEffect, useRef } from "react";
import "../pages/ReaderPage.css";

 // CANVAS VIEW: Draws each PDF page on a canvas.
// Keeps the original PDF appearance, but users cannot directly select or copy text.
function PdfPage({ pdf, pageNumber }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let stopped = false;

    async function draw() {
      const page = await pdf.getPage(pageNumber);
      if (stopped) return;

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport,
      }).promise;
    }

    draw();
    return () => {
      stopped = true;
    };
  }, [pdf, pageNumber]);

  return <canvas ref={canvasRef} className="pdf-canvas" />;
}

export default PdfPage;
