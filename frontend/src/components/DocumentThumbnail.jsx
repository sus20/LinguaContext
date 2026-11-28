import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { getDocumentFileUrl } from "../api/documents.api";
import "./DocumentThumbnail.css";

const THUMBNAIL_WIDTH = 360; // drawn 2× bigger than the card, so it looks sharp

// Draws page 1 of a PDF as a small picture
function DocumentThumbnail({ documentId }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let stopped = false;
    let renderTask = null;

    async function drawFirstPage() {
      const pdf = await pdfjsLib.getDocument(getDocumentFileUrl(documentId))
        .promise;
      const page = await pdf.getPage(1);
      if (stopped) return;

      // make the page exactly THUMBNAIL_WIDTH wide
      const scale = THUMBNAIL_WIDTH / page.getViewport({ scale: 1 }).width;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      renderTask = page.render({
        canvasContext: canvas.getContext("2d"),
        viewport,
      });
      try {
        await renderTask.promise;
      } catch {}
    }
    drawFirstPage().catch((error) =>
      console.log("Thumbnail error:", error.message),
    );

    return () => {
      stopped = true;
      if (renderTask) renderTask.cancel();
    };
  }, [documentId]);

  return <canvas ref={canvasRef} className="document-thumbnail" />;
}

export default DocumentThumbnail;
