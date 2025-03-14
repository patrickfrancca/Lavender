"use client";

import { useState } from "react";
import StoryList from "@/components/StoryList";
import UserHeader from "@/components/ui/UserHeader"; // Importa o UserHeader

const themes = [
  { name: "Fantasy", color: "bg-purple-600", image: "https://i.pinimg.com/736x/a5/22/f0/a522f04a5db103d457de9f5f7cc36f97.jpg" },
  { name: "Sci-Fi", color: "bg-blue-600", image: "https://i.pinimg.com/originals/00/80/35/00803555cc38ae7bdec9f43d6823396c.gif" },
  { name: "Romance", color: "bg-pink-600", image: "https://i.pinimg.com/originals/bc/15/2e/bc152e28ac6b179d8223005b23db8a0f.gif" },
  { name: "Adventure", color: "bg-green-600", image: "https://i.pinimg.com/originals/05/e6/c4/05e6c47f300069d81f27619d0196ffad.gif" },
  { name: "Mystery", color: "bg-yellow-600", image: "https://i.pinimg.com/736x/fe/1a/24/fe1a24715ed3687c2feb618941b784a9.jpg" },
  { name: "Horror", color: "bg-red-600", image: "https://i.pinimg.com/originals/69/a8/3f/69a83fbcf3ecd6e74bf136b6cf338f84.gif" },
  { name: "Historical", color: "bg-brown-600", image: "/historical.jpg" },
];

export default function ReadingHub() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const visibleThemes = themes.slice(0, 6);
  const hasMoreThemes = themes.length > 6;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 relative">
      {/* Header com informações do usuário */}
      <header className="absolute top-4 right-4 z-50">
        <UserHeader />
      </header>

      {!selectedTheme && !showPopup && (
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#A8AFF5] to-[#b3bbff8c] bg-clip-text text-transparent">
            Read. Analyze. Reflect. Grow.
          </h1>
          <p className="text-xl text-[#a8aff57a]">
            Use reading as a bridge between theory and real-life action
          </p>
        </div>
      )}

      {!selectedTheme ? (
        <div className="w-full max-w-6xl">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <span className="text-2xl font-bold text-white drop-shadow-md">
                    {theme.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {hasMoreThemes && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowPopup(true)}
                className="text-white rounded-xl px-6 py-3 bg-gradient-to-r bg-[#B3BAFF] hover:bg-[#b3bbffa4] transition-all text-lg font-semibold"
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
            className="mb-6 px-5 py-3 bg-gradient-to-r bg-[#B3BAFF] rounded-2xl hover:bg-[#b3bbff9f] transition-all flex items-center gap-2 text-lg text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Genres
          </button>
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r bg-[#B3BAFF] bg-clip-text text-transparent">
            {selectedTheme} Stories
          </h2>
          <StoryList theme={selectedTheme as string} />
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#B3BAFF]">All themes</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-[#B3BAFF] hover:text-[#b3bbffa2] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
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
                    className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-110"
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
