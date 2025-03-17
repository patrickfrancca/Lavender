"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StoryList from "@/components/StoryList";
import UserHeader from "@/components/ui/UserHeader";
import BackButton from "@/components/BackButton"; // Importa o componente BackButton

const themes = [
  {
    name: "Fantasy",
    color: "bg-purple-600",
    image:
      "https://i.pinimg.com/736x/9e/ed/53/9eed536fc991997bedc60614bc91c618.jpg",
  },
  {
    name: "Sci-Fi",
    color: "bg-blue-600",
    image:
      "https://i.pinimg.com/originals/00/80/35/00803555cc38ae7bdec9f43d6823396c.gif",
  },
  {
    name: "Real-Crime",
    color: "bg-green-600",
    image:
      "https://i.pinimg.com/originals/05/e6/c4/05e6c47f300069d81f27619d0196ffad.gif",
  },
  {
    name: "Horror",
    color: "bg-red-600",
    image:
      "https://i.pinimg.com/736x/c5/1f/85/c51f8595381b545128e4cfd82765daa7.jpg",
  },
  {
    name: "Mystery",
    color: "bg-yellow-600",
    image:
      "https://i.pinimg.com/736x/fe/1a/24/fe1a24715ed3687c2feb618941b784a9.jpg",
  },
  {
    name: "Romance",
    color: "bg-pink-600",
    image:
      "https://i.pinimg.com/originals/bc/15/2e/bc152e28ac6b179d8223005b23db8a0f.gif",
  },
  {
    name: "Dystopia",
    color: "bg-brown-600",
    image:
      "https://i.pinimg.com/736x/a0/ae/08/a0ae08bb607902d35c7f06bfbfc48ca8.jpg",
  },
];

export default function ReadingHub() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const visibleThemes = themes.slice(0, 6);
  const hasMoreThemes = themes.length > 6;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 relative">
      {/* Botão "Return to Home" */}
      <div className="absolute top-4 left-4 z-50">
        <BackButton destination="/" label="Return to Home" />
      </div>

      {/* Header com informações do usuário */}
      <header className="absolute top-4 right-4 z-50">
        <UserHeader />
      </header>

      {/* Step #1: Title + subtitle (quando nenhum tema estiver selecionado e o popup estiver fechado) */}
      {!selectedTheme && !showPopup && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#A8AFF5] to-[#b3bbff8c] bg-clip-text text-transparent">
            Read. Analyze. Reflect. Grow.
          </h1>
          <p className="text-xl text-[#a8aff57a]">
            Use reading as a bridge between theory and real-life action
          </p>
        </motion.div>
      )}

      {/* Se nenhum tema for selecionado, exibe os temas; caso contrário, exibe a lista de histórias do tema selecionado */}
      {!selectedTheme ? (
        <>
          {/* Step #2: Container de Cards */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, ease: "easeOut" }}
            className="w-full max-w-6xl flex flex-col items-center"
          >
            <div className="w-full">
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
            </div>
          </motion.div>

          {/* Step #3: Botão "See more themes" (se houver mais temas) */}
          {hasMoreThemes && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, ease: "easeOut" }}
              className="text-center mt-8"
            >
              <button
                onClick={() => setShowPopup(true)}
                className="text-white rounded-xl px-6 py-3 bg-gradient-to-r bg-[#B3BAFF] hover:bg-[#b3bbffa4] transition-all text-lg font-semibold"
              >
                See more Themes
              </button>
            </motion.div>
          )}
        </>
      ) : (
        // Se um tema for selecionado, exibe o botão "Back to Genres", o cabeçalho e a lista de histórias em três motion.div separados
        <div className="w-full max-w-4xl">
          {/* Motion para o botão "Back to Genres" */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, ease: "easeOut" }}
          >
            <button
              onClick={() => setSelectedTheme(null)}
              className="mb-6 px-5 py-3 bg-gradient-to-r bg-[#B3BAFF] rounded-2xl hover:bg-[#b3bbff9f] transition-all flex items-center gap-2 text-lg text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <strong>Back to Themes</strong>
            </button>
          </motion.div>

          {/* Motion para o cabeçalho com o tema selecionado */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r bg-[#B3BAFF] bg-clip-text text-transparent">
              {selectedTheme} Stories
            </h2>
          </motion.div>

          {/* Motion para a lista de histórias */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, ease: "easeOut" }}
          >
            <StoryList theme={selectedTheme as string} />
          </motion.div>
        </div>
      )}

      {/* Popup com todos os temas */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          {/* Motion para o container (retângulo) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white p-8 rounded-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Motion para o cabeçalho "All themes" */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, ease: "easeOut" }}
              className="flex justify-between items-center mb-6"
            >
              <h2 className="text-3xl font-bold text-[#B3BAFF]">All Themes</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-[#B3BAFF] hover:text-[#b3bbffa2] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>

            {/* Motion para a grade de temas */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
            >
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
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
