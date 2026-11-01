import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LibraryPage from "./pages/LibraryPage";
import ReviewPage from "./pages/ReviewPage";
import WordsPage from "./pages/WordsPage";
import ReaderPage from "./pages/ReaderPage";

function App() {
  const [openFile, setOpenFile] = useState(null);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/library" />} />
        <Route
          path="/library"
          element={<LibraryPage onOpenFile={setOpenFile} />}
        />
        <Route path="/words" element={<WordsPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/read" element={<ReaderPage file={openFile} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
