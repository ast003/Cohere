import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { io } from "socket.io-client";

const SOCKET_SERVER = "http://localhost:5000"; 
const DOCUMENT_ID = "my-doc-1"; // Unique document ID

const Editor = () => {
  const [editorValue, setEditorValue] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const socket = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    socket.current = io(SOCKET_SERVER);

    socket.current.emit("get-document", DOCUMENT_ID);

    socket.current.on("load-document", (content) => {
      setEditorValue(content);
    });

    socket.current.on("receive-changes", (delta) => {
      quillRef.current.getEditor().updateContents(delta);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleTextChange = (content, delta, source) => {
    if (source === "user") {
      socket.current.emit("send-changes", { docId: DOCUMENT_ID, delta });
      socket.current.emit("save-document", { docId: DOCUMENT_ID, content });
    }
    setEditorValue(content);
  };

  const handlePromptChange = (e) => {
    setAiPrompt(e.target.value);
  };

  const handleAIHelp = async () => {
    if (!aiPrompt.trim()) {
      setError("Please provide a prompt for AI.");
      return;
    }

    setLoading(true);
    setError(null);
    setAiResponse("");
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: aiPrompt }] }],
        }
      );

      const suggestion =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No suggestion generated.";
      setAiResponse(suggestion);
    } catch (err) {
      console.error("Error fetching AI help:", err.response?.data || err.message);
      setError("Failed to get AI help. Please check your API key or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Workspace</h1>
      <div className="bg-white shadow-md rounded-lg p-4 flex-grow flex flex-col space-y-4">
        <ReactQuill
          ref={quillRef}
          value={editorValue}
          onChange={handleTextChange}
          className="h-full"
        />
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-600">AI Prompt</h2>
          <input
            type="text"
            value={aiPrompt}
            onChange={handlePromptChange}
            placeholder="Enter your prompt for AI..."
            className="w-full p-2 border border-gray-300 rounded"
            aria-label="AI Prompt"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAIHelp}
            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Getting AI Help..." : "Get AI Suggestion"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        {aiResponse && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              AI Suggestion
            </h2>
            <p className="text-gray-700">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
