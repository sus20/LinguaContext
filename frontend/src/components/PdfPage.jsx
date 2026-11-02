import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import "./PdfPage.css";

// controls the size of the PDF page and its text layer
const SCALE = 1.5;

// Displays one PDF page using two layers:
// canvas keeps the original PDF appearance.
// text layer adds selectable text on top of the canvas.
function PdfPage({ pdf, pageNumber }) {
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);

  useEffect(() => {
    // track whether this effect is still active
    let stopped = false;

    // store rendering tasks so they can be cancelled during cleanup
    let renderTask = null;
    let textLayer = null;

    async function draw() {
      // get the requested page from the pdf
      const page = await pdf.getPage(pageNumber);
      if (stopped) return;

      // calculate the page dimensions using the selected scale
      const viewport = page.getViewport({ scale: SCALE });

      // STEP 1: Draw the PDF on the canvas
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // start rendering the PDF page as an image
      renderTask = page.render({
        canvasContext: canvas.getContext("2d"),
        viewport,
      });

      try {
        // wait until canvas rendering finishes
        await renderTask.promise;
      } catch (error) {
        console.log("Page", pageNumber, "picture stopped:", error.message);
        return; // stop if canvas rendering fails or is cancelled
      }

      try {
        // STEP 2: Add selectabe text over the canvas
        // extract text and its position information from the PDF page
        const content = await page.getTextContent();

        if (stopped) return;

        // remove any previos text layer content
        textLayerRef.current.innerHTML = "";

        // create a text layer positioned to match the canvas
        textLayer = new pdfjsLib.TextLayer({
          textContentSource: content,
          container: textLayerRef.current,
          viewport,
        });

        // render the selectable text inside the text layer
        await textLayer.render();
        console.log("Page", pageNumber, "text layer done");
      } catch (error) {
        console.log("Page", pageNumber, "text layer ERROR:", error.message);
      }
    }

    draw();

    // stop outdated work when the page changes or the component unmounts
    return () => {
      stopped = true;
      if (renderTask) renderTask.cancel();
      if (textLayer) textLayer.cancel();
    };
  }, [pdf, pageNumber]);

  return (
    // keep the canvas and selectable text layer together
    <div className="pdf-page" style={{ "--scale-factor": SCALE }}>
      <canvas ref={canvasRef} />
      <div ref={textLayerRef} className="textLayer" />
    </div>
  );
}

export default PdfPage;
