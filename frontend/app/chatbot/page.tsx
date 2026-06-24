"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setOutput("");
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("http://localhost:3000/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input }),
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setOutput(prev => prev + chunk);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message ?? "Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    controllerRef.current?.abort();
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
      <h2>ChatGPT Streaming</h2>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        placeholder="Type your message…"
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          resize: "vertical",
          marginBottom: 12
        }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>

        {loading && (
          <button onClick={stopGeneration}>
            Stop
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginTop: 12 }}>
          {error}
        </div>
      )}

      <pre
        ref={outputRef}
        style={{
          whiteSpace: "pre-wrap",
          marginTop: 20,
          padding: 16,
          minHeight: 200,
          maxHeight: 400,
          overflowY: "auto",
          background: "#f7f7f7",
          borderRadius: 6
        }}
      >
        {output || (loading ? "Thinking…" : "")}
      </pre>
    </main>
  );
}
