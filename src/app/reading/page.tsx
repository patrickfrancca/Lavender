"use client";

import { useState } from "react";
import StoryList from "@/components/StoryList";

const themes = [
  { name: "Fantasy", color: "bg-purple-600", image: "https://i.pinimg.com/originals/f9/f5/23/f9f523a25a744665b4ec9f2ab71cd388.gif" },
  { name: "Sci-Fi", color: "bg-blue-600", image: "https://i.pinimg.com/originals/00/80/35/00803555cc38ae7bdec9f43d6823396c.gif" },
  { name: "Romance", color: "bg-pink-600", image: "https://i.pinimg.com/originals/d2/97/76/d29776418306f5b0129b3ac8c852dbb2.gif" },
  { name: "Adventure", color: "bg-green-600", image: "https://i.pinimg.com/originals/dc/d3/df/dcd3df850688cf7cb3672e5536facc5f.gif" },
  { name: "Mystery", color: "bg-yellow-600", image: "/mystery.jpg" },
  { name: "Horror", color: "bg-red-600", image: "https://i.pinimg.com/originals/8e/53/ea/8e53eaa29cd1b52a19995f096c963ce4.gif" },
  { name: "Historical", color: "bg-brown-600", image: "/historical.jpg" },
  // Adicione mais temas se desejar
];

export default function ReadingHub() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const visibleThemes = themes.slice(0, 6); // Mostra apenas os 6 primeiros temas
  const hasMoreThemes = themes.length > 6; // Verifica se há mais de 6 temas

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-6">
      {/* Cabeçalho */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Read. Analyze. Reflect. Grow.
        </h1>
        <p className="text-xl text-gray-300">Use reading as a bridge between theory and real-life action.</p>
      </div>

      {!selectedTheme ? (
        <div className="w-full max-w-6xl">
          {/* Grade de temas com 3 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleThemes.map((theme) => (
              <button
                key={theme.name}
                className="relative group rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => setSelectedTheme(theme.name)}
              >
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <span className="text-2xl font-bold text-white drop-shadow-md">
                    {theme.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Botão "Ver Mais" se houver mais de 6 temas */}
          {hasMoreThemes && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowPopup(true)}
                className="rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all text-lg font-semibold"
              >
                See more themes
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <button
            onClick={() => setSelectedTheme(null)}
            className="mb-6 px-5 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all flex items-center gap-2 text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Genres
          </button>

          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {selectedTheme} Stories
          </h2>
          <StoryList theme={selectedTheme as string} />
        </div>
      )}

      {/* Pop-up com todos os temas */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Todos os Temas</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  className="relative group rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => {
                    setSelectedTheme(theme.name);
                    setShowPopup(false);
                  }}
                >
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <span className="text-2xl font-bold text-white drop-shadow-md">
                      {theme.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}