import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Initialize history state directly from localStorage
  const initialHistory = () => {
    const savedHistory = localStorage.getItem('summarizerHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  };
  const [history, setHistory] = useState(initialHistory());

  const [inputText, setInputText] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('summarizerHistory', JSON.stringify(history));
  }, [history]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }

    setError('');
    setSummaryData(null);

    try {
      const response = await fetch('text-summarizer-genai.vercel.app/get-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: inputText,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to summarize text.');
        return;
      }

      const data = await response.json();
      setSummaryData(data);

      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        original: inputText,
        summary: data.summary,
        title: data.title || 'Untitled',
        timestamp: new Date().toLocaleString()
      };

      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Keep last 10 summaries
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummaryData(null);
    setError('');
  };

  const loadFromHistory = (item) => {
    setInputText(item.original);
    setSummaryData({
      summary: item.summary,
      title: item.title
    });
    setIsHistoryOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('summarizerHistory');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Text Summarizer</h1>
        <div className="history-controls">
          <button
            className="history-button"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            {isHistoryOpen ? 'Hide History' : 'Show History'}
          </button>
          {history.length > 0 && (
            <button
              className="clear-history-button"
              onClick={clearHistory}
            >
              Clear History
            </button>
          )}
        </div>
      </header>

      <div className="content-container">
        {isHistoryOpen && (
          <div className="history-panel">
            <h3>Previous Summaries</h3>
            {history.length === 0 ? (
              <p className="empty-history">No history yet</p>
            ) : (
              <ul className="history-list">
                {history.map(item => (
                  <li key={item.id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-title">{item.title}</span>
                      <span className="history-timestamp">{item.timestamp}</span>
                    </div>
                    <p className="history-summary-preview">
                      {item.summary.substring(0, 100)}...
                    </p>
                    <button
                      className="load-history-button"
                      onClick={() => loadFromHistory(item)}
                    >
                      Load
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="main-content">
          <div className="input-section">
            <textarea
              className="input-text"
              placeholder="Enter text to summarize..."
              rows="10"
              value={inputText}
              onChange={handleInputChange}
            />
            <div className="button-group">
              <button
                className="summarize-button"
                onClick={handleSummarize}
                disabled={!inputText.trim()}
              >
                Summarize
              </button>
              <button
                className="clear-button"
                onClick={handleClear}
                disabled={!inputText && !summaryData}
              >
                Clear
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {summaryData && (
            <div className="result-section">
              <h2>Summary</h2>
              {summaryData.title && (
                <div className="summary-title">
                  <span className="title-label">Title:</span> {summaryData.title}
                </div>
              )}
              <div className="summary-content">
                {summaryData.summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
