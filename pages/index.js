import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLetter = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generateLetter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setLetter(data.letter);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const response = await fetch("/api/generatePdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "letter.pdf";
        link.click();
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Generate a Letter</h1>
      <textarea
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: "100px", marginBottom: "20px" }}
      />
      <button onClick={generateLetter} disabled={loading}>
        {loading ? "Generating..." : "Generate Letter"}
      </button>
      {letter && (
        <div style={{ marginTop: "20px" }}>
          <h2>Generated Letter:</h2>
          <pre>{letter}</pre>
          <button onClick={downloadPdf}>Download as PDF</button>
        </div>
      )}
    </div>
  );
}

