import { useEffect, useRef } from "react";

// paints one page of the pdf into a canvas
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

  return <canvas ref={canvasRef} />;
}

export default PdfPage;
