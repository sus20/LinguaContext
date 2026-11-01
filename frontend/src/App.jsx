import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LibraryPage from "./pages/LibraryPage";
import ReviewPage from "./pages/ReviewPage";
import WordsPage from "./pages/WordsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/library" />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/words" element={<WordsPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;