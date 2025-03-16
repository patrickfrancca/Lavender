/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CountdownTimer from "@/components/CountdownTimer"; // Importa o componente do contador

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
  default: ["/audio/arabic.mp3", "/audio/intothedarkness.mp3"],
};

/**
 * Custom hook para gerenciar o áudio de fundo.
 */
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
        background: "white",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        fontFamily: "'Inter', sans-serif",
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
              className="text-gray-500 hover:text-gray-700 transition-colors shrink-0"
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
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(
    null
  );
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

  // Contador para leitura: cada página tem seu próprio timer salvo por usuário.
  // Usamos uma chave única (ex: "readingTimer_<user>") para salvar o valor.
  const TIMER_DURATION = 10 * 60; // 10 minutos em segundos
  const userId = session?.user?.id || session?.user?.email;
  const timerKey = userId ? `readingTimer_${userId}` : "readingTimer";

  // Busca a história com base no slug
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

  // Define o contador de definições com base nos dados do usuário
  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
    const userKey = session.user.id || session.user.email;
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
    const userKey = session.user.id || session.user.email;
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
    const userId = session.user.id || session.user.email;
    const readingKey = `readingStatus_${userId}`;
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#E5D8B2]">
        <svg
          className="animate-spin h-12 w-12 text-[#612b16]"
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#E5D8B2]">
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#E5D8B2] p-6 overflow-hidden relative">
      {/* Contador para leitura – salvo por usuário e independente para esta página */}
      <div className="absolute bottom-4 right-4">
        <CountdownTimer timerKey={timerKey} initialDuration={TIMER_DURATION} />
      </div>

      <article className="w-full max-w-5xl bg-[#f4e8c1] border-l-8 border-[#612b16] rounded-r-lg shadow-lg p-8 relative old-book">
        {!isFinished && (
          <button
            onClick={handleFinishReading}
            className="absolute top-4 right-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
          >
            Finish Reading
          </button>
        )}
        {isFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <svg
              className="w-20 h-20 text-green-600 animate-bounce"
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
          <p className="mt-2 text-xl text-gray-700 text-center description">
            {story.description}
          </p>
        </header>
        <div className="text-center mb-6">
          <hr className="border-t-2 border-[#854a2227] w-1/2 mx-auto" />
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
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-[#612b16] text-white font-semibold rounded hover:bg-[#8c3b24] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous Page
          </button>
          {currentPage < totalPages - 1 ? (
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-[#612b16] text-white font-semibold rounded hover:bg-[#8c3b24] transition"
            >
              Next Page →
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">End of story</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-[#612b16] text-white font-semibold rounded hover:bg-[#8c3b24] transition"
          >
            {isPlaying ? "Sound ON" : "Sound OFF"}
          </button>
          <button
            onClick={() => setSoundKey((prev) => prev + 1)}
            className="px-4 py-2 bg-[#612b16] text-white font-semibold rounded hover:bg-[#8c3b24] transition"
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
              className="w-32 h-2 rounded-full appearance-none cursor-pointer bg-gray-300"
              style={{
                background: `linear-gradient(to right, #612b16 ${volume * 100}%, #e5e7eb ${
                  volume * 100
                }%)`,
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
      </article>
      <style jsx>{`
        .drop-cap::first-letter {
          font-family: "Georgia", serif;
          font-size: 4rem;
          font-weight: bold;
          float: left;
          margin-right: 12px;
          line-height: 1;
          color: #333;
        }
        p:not(.description) {
          text-align: justify;
        }
        .old-book {
          background: linear-gradient(to bottom, #f4e8c1, #e8d9a9 50%, #f4e8c1);
          border: 2px solid #d1b894;
          border-left: 8px solid #612b16;
          border-radius: 0 10px 10px 0;
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1),
            5px 0 10px -5px rgba(0, 0, 0, 0.2),
            0 5px 15px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .old-book::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACJJREFUKFNjZICC0/8/Mvj//z8DDAwM/MfAxEB8HgzG/////wD1vQv5jX8eOQAAAABJRU5ErkJggg==') repeat;
          opacity: 0.05;
          pointer-events: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #612b16;
          cursor: pointer;
          margin-top: -7px;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #612b16;
          cursor: pointer;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </main>
  );
}
