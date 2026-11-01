import "./LibraryPage.css"

function LibraryPage() {
  // runs when the user picks a file
  function handleFileChange(event) {
    const file = event.target.files[0];
    console.log("Selected file:", file);
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
