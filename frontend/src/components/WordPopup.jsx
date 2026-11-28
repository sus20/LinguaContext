import "./WordPopup.css";

// Shows the u:ai answer for one selected word
function WordPopup({ popup, onClose }) {
  const { word, sentence, x, y, loading, result, error } = popup;

  return (
    <div className="word-popup" style={{ left: x, top: y }}>
      <div className="word-popup-header">
        <h3>{word}</h3>
        <button className="word-popup-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {loading && <p className="word-popup-muted">Asking u:ai…</p>}
      {error && <p className="word-popup-error">{error}</p>}

      {result && (
        <>
          <p className="word-popup-type">
            <strong>{result.word_type}</strong> · {result.translation}
          </p>
          <p>In this context: {result.explanation}</p>

          <hr />

          <p className="word-popup-label">Sentence from your PDF</p>
          <p className="word-popup-sentence">„{sentence}“</p>
          <p className="word-popup-muted">→ {result.sentence_translation}</p>

          <button
            className="word-popup-save"
            onClick={() => console.log("Save comes in W2:", word)}
          >
            + Save word with this context
          </button>
        </>
      )}
    </div>
  );
}

export default WordPopup;
