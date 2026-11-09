import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../api/documents.api";
import "./LibraryPage.css";

function LibraryPage() {
  const navigate = useNavigate();

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // upload the pdf to the backend
      const answer = await uploadDocument(file);

      // print the backend response
      console.log("Backend resoponse:", answer);

      // Navigate using the document ID
      navigate(`/read/${answer.document.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  return (
    <main className="page">
      <h1>My Library</h1>
      <p>Your documents and learning progress</p>

      <div className="grid">
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
