
"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState(6);
  const [cfg, setCfg] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setImageUrl("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, steps, cfg }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <main className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">AI Image Generation</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700">Steps: {steps}</label>
            <input
              type="range"
              id="steps"
              min="1"
              max="20"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label htmlFor="cfg" className="block text-sm font-medium text-gray-700">CFG: {cfg}</label>
            <input
              type="range"
              id="cfg"
              min="1"
              max="10"
              step="0.1"
              value={cfg}
              onChange={(e) => setCfg(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={generateImage}
            disabled={loading || !prompt}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate Image"}
          </button>
        </div>

        {loading && (
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
          </div>
        )}

        {imageUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-center mb-4">Generated Image</h2>
            <img src={imageUrl} alt="Generated Image" className="w-full rounded-lg shadow-md" />
          </div>
        )}
      </main>
    </div>
  );
}
