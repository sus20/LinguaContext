import { useNavigate } from "react-router-dom";
import DocumentThumbnail from "./DocumentThumbnail";
import "./DocumentCard.css";

function DocumentCard({ document, onDelete }) {
  const navigate = useNavigate();

  function handleDeleteClick(event) {
    event.stopPropagation(); // dont open the PDF.

    const ok = window.confirm(`Delete "${document.filename}"?`);
    if (ok) onDelete(document.id);
  }

  return (
    <div
      className="document-card"
      onClick={() => navigate(`/read/${document.id}`)}
    >
      <button className="delete-btn" onClick={handleDeleteClick} title="Delete">
        ✕
      </button>
      <div className="document-preview">
        <DocumentThumbnail documentId={document.id} />
      </div>
      <p className="document-name">{document.filename}</p>
    </div>
  );
}

export default DocumentCard;
