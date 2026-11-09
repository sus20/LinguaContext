import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import LibraryPage from "./pages/LibraryPage";
import ReviewPage from "./pages/ReviewPage";
import WordsPage from "./pages/WordsPage";
import ReaderPage from "./pages/ReaderPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/library" />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/words" element={<WordsPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/read/:documentId" element={<ReaderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
