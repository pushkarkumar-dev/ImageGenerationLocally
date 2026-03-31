
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resolution, setResolution] = useState("1088x1088");
  const [batchSize, setBatchSize] = useState(1);
  const [activeTab, setActiveTab] = useState("image");
  const [videoUrl, setVideoUrl] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setImageUrls([]);
    try {
      const [width, height] = resolution.split("x").map(Number);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, width, height, batch_size: batchSize }),
      });
      const data = await response.json();
      if (data.imageUrls) {
        setImageUrls(data.imageUrls);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const generateVideo = async () => {
    setLoading(true);
    setVideoUrl(null);
    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.videoUrls) {
        setVideoUrl(data.videoUrls[0]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const openModal = (url) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <main className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Pushkar's Nano Banana</h1>

        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'image' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('image')}
          >
            Text to Image
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'video' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('video')}
          >
            Text to Video
          </button>
        </div>

        {activeTab === 'image' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="resolution" className="block text-sm font-medium text-gray-700">Resolution</label>
              <select
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              >
                <option value="1088x1088">1088x1088 (Square)</option>
                <option value="1024x576">1k (16:9)</option>
                <option value="576x1024">1k (9:16)</option>
                <option value="2048x1152">2k (16:9)</option>
                <option value="1152x2048">2k (9:16)</option>
                <option value="4096x2304">4k (16:9)</option>
                <option value="2304x4096">4k (9:16)</option>
              </select>
            </div>

            <div>
              <label htmlFor="batchSize" className="block text-sm font-medium text-gray-700">Number of Images: {batchSize}</label>
              <input
                type="range"
                id="batchSize"
                min="1"
                max="8"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <button
                onClick={generateImage}
                disabled={loading || !prompt}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {loading ? "Generating..." : "Generate Image"}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              />
            </div>
            <div>
              <button
                onClick={generateVideo}
                disabled={loading || !prompt}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {loading ? "Generating..." : "Generate Video"}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
          </div>
        )}

        {imageUrls.length > 0 && activeTab === 'image' && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-900">Generated Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Generated Image ${index + 1}`}
                  className="w-full rounded-lg shadow-md cursor-pointer"
                  onClick={() => openModal(url)}
                />
              ))}
            </div>
          </div>
        )}

        {videoUrl && activeTab === 'video' && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-900">Generated Video</h2>
            <video controls src={videoUrl} className="w-full rounded-lg shadow-md" />
          </div>
        )}
      </main>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged Image"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-300 bg-gray-800 bg-opacity-75 rounded-full p-2 text-2xl leading-none hover:text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <footer className="absolute bottom-4 right-4 text-gray-500 text-sm">
        Pushkar
      </footer>
    </div>
  );
}
