import { useNavigate } from "react-router-dom";
import "./LibraryPage.css";

function LibraryPage({onOpenFile}) {
    const navigate = useNavigate();

  function handleFileChange(event) {
    console.log("Hello! I am the handleFileChangeFunction from LibraryPage")

    const file = event.target.files[0];
    if (!file) return;

    onOpenFile(file);   // put the file in App's box
    navigate("/read");  // go to the reader page
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
