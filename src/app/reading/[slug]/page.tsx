/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CountdownTimer from "@/components/CountdownTimer"; // Importa o componente do contador
import UserHeader from "@/components/ui/UserHeader"; // Importa o componente do cabeçalho do usuário
import BackButton from "@/components/BackButton"; // Importa o novo componente de botão "Voltar"
import { motion } from "framer-motion";

interface Story {
  title: string;
  description: string;
  content: string;
  theme?: string;
}

const MAX_DEFINITIONS_PER_DAY = 30;

const backgroundSounds: { [key: string]: string[] } = {
  fantasy: [
    "/audio/arabic.mp3",
    "/audio/intothedarkness.mp3",
    "/audio/magicforest.mp3",
    "/audio/lastdays.mp3",
    "/audio/horror.mp3",
  ],
  default: ["", ""],
};

function useBackgroundAudio(
  theme: string,
  isPlaying: boolean,
  volume: number,
  soundKey: number
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const themeKey = theme ? theme.trim().toLowerCase() : "default";
      const tracks = backgroundSounds[themeKey] || backgroundSounds["default"];
      const randomIndex = Math.floor(Math.random() * tracks.length);
      const selectedTrack = tracks[randomIndex];
      console.log("New track for theme", themeKey, ":", selectedTrack);
      audioRef.current.src = selectedTrack;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((e) =>
          console.error("Error playing audio:", e)
        );
      }
    }
  }, [theme, soundKey]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch((e) =>
          console.error("Error playing audio:", e)
        );
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return audioRef.current;
}

// Componente para o ícone (seta) utilizado em botões
const ArrowIcon = ({
  rotate = false,
  className = "",
}: {
  rotate?: boolean;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className} ${rotate ? "transform rotate-180" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const Popup = ({
  definition,
  position,
  onClose,
  loading,
  word,
  definitionCount,
  maxDefinitions,
}: {
  definition: string | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  loading: boolean;
  word: string | null;
  definitionCount: number;
  maxDefinitions: number;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  if (!position || !word) return null;

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        top: position.y + 20,
        left: position.x,
        background: "rgba(255,255,255,0.95)",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        fontFamily: "'Poppins', sans-serif",
        maxWidth: "280px",
        transform: "translateX(-50%)",
        transition: "all 0.2s ease-out",
      }}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <svg
            className="animate-spin h-5 w-5 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-gray-700">Loading definition...</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <span className="font-semibold text-gray-900">'{word}':</span>
              <span className="text-gray-700 text-base ml-1">{definition}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-[#8080809d] transition-colors shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="text-right text-gray-500 text-sm">
            {definitionCount}/{maxDefinitions}
          </div>
        </div>
      )}
    </div>
  );
};

export default function StoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [definition, setDefinition] = useState<string | null>(null);
  const [definitionWord, setDefinitionWord] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const [definitionCount, setDefinitionCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.01);
  const [isFinished, setIsFinished] = useState(false);

  // Estado para o áudio
  const [audioTheme, setAudioTheme] = useState("default");
  useEffect(() => {
    if (story && story.theme && story.theme.trim() !== "") {
      setAudioTheme(story.theme);
    } else {
      setAudioTheme("default");
    }
  }, [story]);

  const [soundKey, setSoundKey] = useState(0);
  useBackgroundAudio(audioTheme, isPlaying, volume, soundKey);

  const TIMER_DURATION = 10 * 60; // 10 minutos em segundos
  const userId = session?.user?.id || session?.user?.email;
  const timerKey = userId ? `readingTimer_${userId}` : "readingTimer";

  // Estado para o modo leitura (página amarelada)
  const [readingMode, setReadingMode] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/stories/${slug}`);
        if (!res.ok) throw new Error("Story not found");
        const data = await res.json();
        setStory(data.story);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [slug]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
    const userKey = session.user?.id || session.user?.email;
    const today = new Date().toISOString().slice(0, 10);
    const storedDate = localStorage.getItem(`definitionDate_${userKey}`);
    const storedCount = localStorage.getItem(`definitionCount_${userKey}`);
    if (storedDate === today && storedCount) {
      setDefinitionCount(parseInt(storedCount));
    } else {
      localStorage.setItem(`definitionDate_${userKey}`, today);
      localStorage.setItem(`definitionCount_${userKey}`, "0");
      setDefinitionCount(0);
    }
  }, [session, status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setDefinition(null);
      setPopupPosition(null);
      setDefinitionWord(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const paragraphs = story
    ? story.content.split("\n").filter((p) => p.trim() !== "")
    : [];
  const paragraphsPerPage = 4;
  const pages = [];
  for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
    pages.push(paragraphs.slice(i, i + paragraphsPerPage));
  }
  const totalPages = pages.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleWordClick = async (word: string, event: React.MouseEvent) => {
    if (status === "loading" || !session) return;
    const userKey = session.user?.id || session.user?.email;
    setDefinitionWord(word);
    setPopupPosition({ x: event.clientX, y: event.clientY });
    if (definitionCount >= MAX_DEFINITIONS_PER_DAY) {
      setDefinition(
        "You have reached the limit of 30 definitions today. Please come back tomorrow for more."
      );
      return;
    }
    setIsLoadingDefinition(true);
    try {
      const response = await fetch("/api/define-rd-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      if (!response.ok) throw new Error("Failed to fetch definition.");
      const data = await response.json();
      setDefinition(data.definition);
      const newCount = definitionCount + 1;
      setDefinitionCount(newCount);
      localStorage.setItem(`definitionCount_${userKey}`, newCount.toString());
    } catch (error) {
      console.error("Error fetching definition:", error);
      setDefinition("Definition not available.");
    } finally {
      setIsLoadingDefinition(false);
    }
  };

  const splitParagraphIntoWords = (paragraph: string) => {
    return paragraph.split(/(\s+)/).map((part, index) => {
      if (/\s+/.test(part)) {
        return part;
      } else {
        return (
          <span
            key={index}
            className="cursor-pointer hover:underline"
            onClick={(event) => handleWordClick(part, event)}
          >
            {part}
          </span>
        );
      }
    });
  };

  const handleFinishReading = () => {
    setIsFinished(true);
    if (!session) return;
    const userKey = session.user?.id || session.user?.email;
    const readingKey = `readingStatus_${userKey}`;
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      readingKey,
      JSON.stringify({ status: "DONE", date: today })
    );
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F9FF]">
        <svg
          className="animate-spin h-12 w-12 text-[#B3BAFF]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading story...</p>
      </div>
    );

  if (!story)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F9FF]">
        <svg
          className="h-12 w-12 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <p className="mt-4 text-lg font-medium text-red-500">Story not found.</p>
      </div>
    );

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden relative"
      style={{ backgroundColor: readingMode ? "#fff9e6" : "#F7F9FF" }}
    >
      {/* Botão "Voltar" utilizando o componente BackButton */}
      <div className="absolute top-4 left-4 z-50">
        <BackButton destination="/reading" />
      </div>

      {/* UserHeader posicionado no canto superior direito */}
      <div className="absolute top-4 right-4 z-50">
        <UserHeader />
      </div>

      {/* Contador para leitura – posicionado no canto inferior direito */}
      <div className="absolute bottom-4 right-4">
        <CountdownTimer timerKey={timerKey} initialDuration={TIMER_DURATION} />
      </div>

      {/* Motion envolta do conteúdo da história */}
      <motion.article
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, ease: "easeOut" }}
        className="notebook w-full max-w-5xl rounded-lg shadow-xl p-8 relative"
        style={{ backgroundColor: readingMode ? "#fff9e6" : "white" }}
      >
        {!isFinished && (
          <button
            onClick={handleFinishReading}
            className={`absolute top-4 right-4 px-4 py-2 bg-[#B3BAFF] text-white font-semibold rounded-xl transition hover:bg-[#b3bbffad] ${
              currentPage === totalPages - 1 ? "animate-float" : ""
            }`}
          >
            Finish Reading
          </button>
        )}
        {isFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
            <svg
              className="w-20 h-20 text-[#B3BAFF] animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800">{story.title}</h1>
          <p className="description mt-2 text-xl text-gray-600 text-center">
            {story.description}
          </p>
        </header>
        <div className="text-center mb-6">
          <hr className="border-t-2 border-[#B3BAFF] w-1/2 mx-auto" />
        </div>
        <div className="h-[600px] overflow-hidden relative">
          <section
            className="flex transition-all duration-500"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((page, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                {page.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className={`mb-8 text-xl ${
                      index === 0 && pIndex === 0 ? "drop-cap" : ""
                    }`}
                  >
                    {splitParagraphIntoWords(paragraph)}
                  </p>
                ))}
              </div>
            ))}
          </section>
        </div>
        <div className="flex justify-between mt-6 relative">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="flex items-center px-4 py-2 bg-[#B3BAFF] text-white font-semibold rounded-xl hover:bg-[#a0a5ff8e] transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ width: "200px" }}
          >
            <ArrowIcon className="mr-2" />
            <span>Previous Page</span>
          </button>
          {currentPage < totalPages - 1 ? (
            <button
              onClick={handleNextPage}
              className="flex items-center px-4 py-2 bg-[#B3BAFF] text-white font-semibold rounded-xl hover:bg-[#a0a5ff91] transition"
              style={{ width: "150px" }}
            >
              <span>Next Page</span>
              <ArrowIcon rotate className="ml-2" />
            </button>
          ) : (
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <p className="handwritten text-4xl">End of story.</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-4">
          {/* Botão para alternar o modo leitura */}
          <button
            onClick={() => setReadingMode(!readingMode)}
            className="px-4 py-2 bg-[#f0e65c] text-white font-semibold rounded-xl hover:bg-[#f0e65c8f] transition"
          >
            {readingMode ? "Switch to Normal Mode" : "Switch to Reading Mode"}
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-[#B3BAFF] text-white font-semibold rounded-xl hover:bg-[#a0a5ff86] transition"
          >
            {isPlaying ? "Sound ON" : "Sound OFF"}
          </button>
          <button
            onClick={() => setSoundKey((prev) => prev + 1)}
            className="px-4 py-2 bg-[#B3BAFF] text-white font-semibold rounded-xl hover:bg-[#b3bbff93] transition"
          >
            Change Sound
          </button>
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.25 5.25L6 9.75H3v4.5h3L11.25 18v-12z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 8.25l2.25-2.25M15 15.75l2.25 2.25"
              />
            </svg>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 h-2 rounded-full appearance-none cursor-pointer bg-[gray-300]"
              style={{
                background: `linear-gradient(to right, #B3BAFF ${volume * 100}%, #e5e7eb ${volume * 100}%)`,
              }}
            />
          </div>
        </div>
        {popupPosition && (
          <Popup
            word={definitionWord}
            definition={definition}
            position={popupPosition}
            onClose={() => {
              setDefinition(null);
              setPopupPosition(null);
              setDefinitionWord(null);
            }}
            loading={isLoadingDefinition}
            definitionCount={definitionCount}
            maxDefinitions={MAX_DEFINITIONS_PER_DAY}
          />
        )}
      </motion.article>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Corinthia:wght@400;700&display=swap");

        .drop-cap::first-letter {
          font-family: "Corinthia", cursive;
          font-size: 5rem;
          font-weight: bold;
          float: left;
          margin-right: 12px;
          line-height: 1;
          color: #B3BAFF;
        }
        p:not(.description) {
          text-align: justify;
          font-family: "Poppins", sans-serif;
        }
        .notebook {
          background: white;
          border-left: 8px solid #B3BAFF;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          padding: 2rem;
          font-family: "Poppins", sans-serif;
        }
        main {
          background-color: #F7F9FF;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-float {
          animation: float 2s infinite ease-in-out;
        }
        .handwritten {
          font-family: "Corinthia", cursive !important;
          font-size: 2rem;
          color: #B3BAFF;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          animation: typing 3s, step-end ;
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: #B3BAFF; }
        }

        input[type="range"] {
          -webkit-appearance: none; /* Remove o estilo padrão no Chrome/Safari */
          width: 100%;
          background: transparent;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: #B3BAFF; /* Cor desejada */
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
