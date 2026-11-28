import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from "../api/documents.api";
import "./LibraryPage.css";
import DocumentCard from "../components/DocumentCard";

function LibraryPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  // when the page opens, ask the backend for the list
  useEffect(() => {
    async function loadDocuments() {
      const list = await getDocuments();
      setDocuments(list);
    }
    loadDocuments();
  }, []);

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // upload the pdf to the backend
      const answer = await uploadDocument(file);

      console.log("Backend resoponse:", answer);

      // Navigate using the document ID
      navigate(`/read/${answer.document.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  async function handleDelete(documentId) {
    try {
      await deleteDocument(documentId);
      setDocuments((docs) => docs.filter((doc) => doc.id !== documentId));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="page">
      <h1>My Library</h1>
      <p>Your documents and learning progress</p>

      <div className="grid">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
        ))}

        {/* Upload new PDF */}
        <label className="upload-card">
          <span className="plus">+</span>
          <h3> Upload new PDF</h3>
          <p>Start reading</p>
          <input type="file" accept=".pdf" onChange={handleFileChange} hidden />
        </label>
      </div>
    </main>
  );
}

export default LibraryPage;
