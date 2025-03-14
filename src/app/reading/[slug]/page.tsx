/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Story {
  title: string;
  description: string;
  content: string;
}

const MAX_DEFINITIONS_PER_DAY = 30;

const Popup = ({ 
  definition, 
  position, 
  onClose, 
  loading,
  word,
  definitionCount,
  maxDefinitions
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Exibe a contagem de definições */}
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
  const { data: session, status } = useSession();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [definition, setDefinition] = useState<string | null>(null);
  const [definitionWord, setDefinitionWord] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const [definitionCount, setDefinitionCount] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  // Configura a contagem para o usuário utilizando dados da sessão
  useEffect(() => {
    if (status === "loading") return;
    if (!session) return; // Se não houver sessão, redirecione para login ou trate conforme necessário

    // Use session.user.id ou session.user.email como identificador único
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
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setDefinition(null);
        setPopupPosition(null);
        setDefinitionWord(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (status === "loading") return; // Aguarda a sessão carregar
    if (!session) return; // Se não houver sessão, redirecione para login ou trate conforme necessário

    const userKey = session.user.id || session.user.email;
    setDefinitionWord(word);
    setPopupPosition({ x: event.clientX, y: event.clientY });
    
    if (definitionCount >= MAX_DEFINITIONS_PER_DAY) {
      setDefinition("Você atingiu o limite de 30 definições hoje. Volte amanhã para mais.");
      return;
    }
    
    setIsLoadingDefinition(true);
    
    try {
      const response = await fetch("/api/define-rd-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) throw new Error("Failed to fetch definition.");
      
      const data = await response.json();
      setDefinition(data.definition);
      
      // Incrementa a contagem e atualiza o localStorage usando a chave específica do usuário
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
    const parts = paragraph.split(/(\s+)/);
    return parts.map((part, index) => {
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
        <p className="mt-4 text-lg font-medium text-red-500">História não encontrada.</p>
      </div>
    );

  const paragraphs = story.content.split("\n").filter(p => p.trim() !== "");
  const paragraphsPerPage = 4;
  const pages = [];
  for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
    pages.push(paragraphs.slice(i, i + paragraphsPerPage));
  }
  const totalPages = pages.length;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#E5D8B2] p-6 overflow-hidden">
      <article className="w-full max-w-5xl bg-[#f4e8c1] border-l-8 border-[#612b16] rounded-r-lg shadow-lg p-8 relative old-book">
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
            style={{
              transform: `translateX(-${currentPage * 100}%)`,
            }}
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
            ← Previous page
          </button>
          {currentPage < totalPages - 1 ? (
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-[#612b16] text-white font-semibold rounded hover:bg-[#8c3b24] transition"
            >
              Next page →
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">End of story</p>
            </div>
          )}
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
          background: linear-gradient(
            to bottom,
            #f4e8c1,
            #e8d9a9 50%,
            #f4e8c1
          );
          border: 2px solid #d1b894;
          border-left: 8px solid #612b16;
          border-radius: 0 10px 10px 0;
          box-shadow:
            inset 0 0 15px rgba(0, 0, 0, 0.1),
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
      `}</style>
    </main>
  );
}
