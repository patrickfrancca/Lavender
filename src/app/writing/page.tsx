"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/Textarea";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaLightbulb } from "react-icons/fa";

export default function WritingPage() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(
    <>
      Write a text in the field on the left and click on "Check Grammar".{" "}
      <strong>Feedback will appear here</strong>.
    </>
  );
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popupContent, setPopupContent] = useState<{ word: string; definition: string } | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isFetchingDefinition, setIsFetchingDefinition] = useState(false);
  const [isFetchingIdea, setIsFetchingIdea] = useState(false);
  const [idea, setIdea] = useState<string | null>(null);
  const [isInactive, setIsInactive] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const ideaPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!text) {
        setIsInactive(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [text]);

  async function handleCheckGrammar() {
    setIsLoading(true);
    const response = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setStatus(data.status || "");
    setFeedback(data.feedback || "No feedback available.");
    setIsLoading(false);
  }

  async function fetchWordDefinition(word: string) {
    const response = await fetch("/api/define", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word }),
    });
    const data = await response.json();
    return data.definition || "No definition available.";
  }

  async function fetchWritingIdea() {
    setIsFetchingIdea(true);
    try {
      const response = await fetch("/api/generate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setIdea(data.idea || "No idea available.");
    } catch (error) {
      setIdea("Error fetching writing idea.");
    } finally {
      setIsFetchingIdea(false);
    }
  }

  async function handleWordClick(event: React.MouseEvent) {
    const target = event.target as HTMLElement;
    const word = target.innerText;
    if (target.classList.contains("highlight")) {
      const rect = target.getBoundingClientRect();
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setPopupContent(null);
      setIsFetchingDefinition(true);
      setPopupPosition({
        x: rect.left + scrollX + rect.width / 2,
        y: rect.bottom + scrollY + 5,
      });
      try {
        const definition = await fetchWordDefinition(word);
        setPopupContent({ word, definition });
      } catch (error) {
        setPopupContent({ word, definition: "Error fetching definition" });
      } finally {
        setIsFetchingDefinition(false);
      }
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setPopupContent(null);
    }
    if (ideaPopupRef.current && !ideaPopupRef.current.contains(event.target as Node)) {
      setIdea(null);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function getFeedbackTitle() {
    if (!status) {
      return (
        <h3 className="text-2xl font-bold text-gray-400">
          Waiting for your text...
        </h3>
      );
    }
    switch (status.toUpperCase()) {
      case "PERFECT":
        return (
          <h3 className="text-2xl font-bold text-green-400 flex items-center gap-2">
            <FaCheckCircle /> Perfect
          </h3>
        );
      case "ALMOST_THERE":
        return (
          <h3 className="text-2xl font-bold text-[#8D61FA] flex items-center gap-2">
            <FaExclamationCircle /> Almost There
          </h3>
        );
      default:
        return (
          <h3 className="text-2xl font-bold text-gray-400">
            Unknown Status
          </h3>
        );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-16 bg-[#212121] text-white">
      {/* Texto principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#8e60fa] to-[#462f7c] bg-clip-text text-transparent">
          Write. Get Feedback. Rewrite. Learn.
        </h1>
        <p className="mt-4 text-xl text-gray-400">
          Improve your writing skills through iterative feedback
        </p>
      </motion.div>

      {/* Container principal */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="w-full max-w-7xl p-12 bg-[#303030] rounded-xl shadow-3xl text-gray-900"
      >
        <div className="grid grid-cols-2 gap-10">
          {/* Área de escrita */}
          <div className="relative">
            {/* Container com blur condicional (inclui Textarea, popup de ideia e botão Idea) */}
            <div className={`relative ${status.toUpperCase() === "PERFECT" ? "blur-[4px]" : ""}`}>
              <Textarea 
                value={text} 
                onChange={(e) => {
                  setText(e.target.value);
                  setIsInactive(false);
                }}
                placeholder="Write here at least a 2-line text about anything in the language you are learning."
                className="w-full h-[400px] p-6 text-2xl text-white bg-[#212121] rounded-xl border-none shadow-2xl focus:ring-0 focus:outline-none"
              />
              {/* Popup de ideia (fica dentro do container com blur) */}
              {(isFetchingIdea || idea) && (
                <div 
                  ref={ideaPopupRef}
                  className={`absolute bg-[#8D61FA] text-white p-3 rounded-2xl shadow-2xl max-w-md ${
                    isFetchingIdea
                      ? "bottom-4 right-4"
                      : "top-[57%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
                  }`}
                  style={{ zIndex: 1 }}
                >
                  {isFetchingIdea ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating idea...</span>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4">Writing Idea</h3>
                      <p className="text-gray-200">{idea}</p>
                    </>
                  )}
                </div>
              )}
              {/* Botão "Idea" posicionado na parte inferior */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={fetchWritingIdea}
                className={`absolute bottom-3 left-3 px-6 text-white py-3 text-xl bg-[#8D61FA] hover:bg-[#8D61FA] transition-all rounded-xl shadow-md flex items-center justify-center gap-2 ${isInactive ? "animate-pulse" : ""}`}
              >
                <FaLightbulb className="w-6 h-6 text-white" />
                <span>Idea</span>
              </motion.button>
            </div>
            {/* Overlay para "Perfect" */}
            {status.toUpperCase() === "PERFECT" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <FaCheckCircle className="text-green-400 w-16 h-16" />
              </div>
            )}
          </div>

          {/* Área de feedback */}
          <div
            className="w-full h-[400px] p-6 text-2xl text-white bg-[#181818] rounded-xl border-none shadow-2xl flex flex-col items-center justify-center"
            onClick={handleWordClick}
          >
            {status ? (
              <>
                {getFeedbackTitle()}
                <p 
                  className="text-center text-lg mt-4"
                  dangerouslySetInnerHTML={{ __html: feedback }}
                />
              </>
            ) : (
              <p className="text-center text-lg text-gray-400">
                Write text in the left field and click &quot;Check Grammar&quot;.{" "}
                <strong>Feedback will appear here.</strong>
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Popup de definição */}
      {(isFetchingDefinition || popupContent) && (
        <div 
          ref={popupRef}
          className="absolute bg-[#8D61FA] text-white p-3 rounded-2xl shadow-2xl flex items-center gap-2"
          style={{ 
            top: popupPosition.y + 25, 
            left: popupPosition.x,
            minWidth: "120px",
            transform: "translateX(-50%)"
          }}
        >
          {isFetchingDefinition ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading definition...</span>
            </>
          ) : (
            <>
              <strong>{popupContent?.word}:</strong> {popupContent?.definition}
            </>
          )}
        </div>
      )}

      {/* Botões "Check Grammar" e "Home" */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4"
      >
        <button
          onClick={handleCheckGrammar}
          className="mt-6 px-6 py-3 text-xl bg-[#303030] hover:bg-[#8D61FA] transition-all rounded-xl shadow-md flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating feedback</span>
            </>
          ) : (
            "Check Grammar"
          )}
        </button>
        <Link href="/">
          <button 
            className="mt-6 px-6 py-3 text-xl bg-[#8D61FA] transition-all rounded-xl shadow-md flex items-center justify-center gap-2"
            style={{
              boxShadow: status.toUpperCase() === "PERFECT" ? "0 0 10px 2px rgba(141,97,250,0.7)" : "none"
            }}
          >
            Home
          </button>
        </Link>
      </motion.div>

      {/* Estilos globais */}
      <style jsx global>{`
        .highlight {
          color: #60a5fa;
          font-weight: bold;
          position: relative;
          display: inline-block;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .highlight:hover {
          filter: brightness(110%);
        }
        .highlight::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background-color: #60a5fa;
          transform: scaleX(0);
          transform-origin: left;
          animation: highlight 1s ease-in-out forwards;
        }
        @keyframes highlight {
          to {
            transform: scaleX(1);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
