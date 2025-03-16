/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/Textarea";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaLightbulb,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import UserHeader from "@/components/ui/UserHeader";
import CountdownTimer from "@/components/CountdownTimer"; // Importa o contador

export default function WritingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  // Chaves únicas baseadas no ID ou email do usuário
  const userId = session?.user?.id || session?.user?.email;
  const storageKey = userId ? `writingStatus_${userId}` : "writingStatus";
  const timerKey = userId ? `writingTimer_${userId}` : "writingTimer";

  const TIMER_DURATION = 10 * 60; // 10 minutos em segundos

  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(
    <>
      Write a text in the left field and click "Check Grammar".{" "}
      <strong>Feedback will appear here.</strong>
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
  const [showTextContent, setShowTextContent] = useState(false);
  const [correctedText, setCorrectedText] = useState("");
  const [correctionsSummary, setCorrectionsSummary] = useState("");
  const [almostThereCount, setAlmostThereCount] = useState(0);

  const popupRef = useRef<HTMLDivElement>(null);
  const ideaPopupRef = useRef<HTMLDivElement>(null);

  // Lógica de timer foi removida daqui. O componente CountdownTimer agora gerencia tudo.

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
    const newStatus = data.status?.toUpperCase() || "";
    setStatus(newStatus);
    setFeedback(data.feedback || "No feedback available.");
    setIsLoading(false);

    const today = new Date().toISOString().split("T")[0];

    if (newStatus === "PERFECT") {
      localStorage.setItem(storageKey, JSON.stringify({ status: "PERFECT", date: today }));
    } else if (newStatus === "ALMOST_THERE") {
      setAlmostThereCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= 30) {
          setStatus("PERFECT");
          localStorage.setItem(storageKey, JSON.stringify({ status: "PERFECT", date: today }));
          router.push("/");
        }
        return newCount;
      });
    }
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
      setPopupPosition({ x: rect.left + scrollX + rect.width / 2, y: rect.bottom + scrollY + 5 });
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
        <h3 className="text-2xl font-bold text-gray-400">Waiting for your text...</h3>
      );
    }
    switch (status.toUpperCase()) {
      case "PERFECT":
        return (
          <h3 className="text-2xl font-bold text-[#53ff1f] flex items-center gap-2">
            <FaCheckCircle className="pointer-events-none" /> Perfect
          </h3>
        );
      case "ALMOST_THERE":
        return (
          <h3 className="text-2xl font-bold text-[#946dff] flex items-center gap-2">
            <FaExclamationCircle /> Almost There
          </h3>
        );
      default:
        return (
          <h3 className="text-2xl font-bold text-[#ffffff]">Unknown Status</h3>
        );
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-16 bg-[#ffffff]">
      {/* Header com informações do usuário */}
      <header className="absolute top-4 right-4 z-50">
        <UserHeader />
      </header>

      {/* Renderiza o contador via componente */}
      <div className="absolute bottom-4 right-4">
        <CountdownTimer timerKey={timerKey} initialDuration={TIMER_DURATION} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#A8AFF5] to-[#a8aff569] bg-clip-text text-transparent">
          Write. Get Feedback. Rewrite. Learn.
        </h1>
        <p className="mt-4 text-xl text-[#a8aff57a]">
          Improve your writing skills through iterative feedback.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-7xl p-12 bg-[#a8aff55e] rounded-xl shadow-3xl text-[white]"
      >
        <div className="grid grid-cols-2 gap-10">
          {/* Área de escrita */}
          <div className="relative">
            <div className={`relative ${status.toUpperCase() === "PERFECT" ? "blur-[4px]" : ""}`}>
              <Textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setIsInactive(false);
                }}
                placeholder="Write at least 2 lines about any subject in the language you are learning."
                className="w-full h-[400px] p-6 text-2xl text-[#69678A] bg-[#B3BAFF] rounded-xl border-none shadow-2xl focus:ring-0 focus:outline-none placeholder:text-[#ffffff]"
                disabled={status.toUpperCase() === "PERFECT"}
              />
              <div className="absolute bottom-5 left-3 flex flex-col items-start gap-2">
                {(isFetchingIdea || idea) && (
                  <div
                    ref={ideaPopupRef}
                    className="bg-[#cdd2ff] text-[#ffffff] p-3 rounded-2xl shadow-2xl max-w-md"
                    style={{ zIndex: 1 }}
                  >
                    {isFetchingIdea ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 border-4 border-[white] border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating idea...</span>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold mb-4">Writing Idea</h3>
                        <p className="text-[#ffffff]">{idea}</p>
                      </>
                    )}
                  </div>
                )}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={fetchWritingIdea}
                  disabled={status.toUpperCase() === "PERFECT"}
                  className="px-6 py-3 text-xl hover:bg-[#d5d9ff6c] transition-all text-[#ffffff] rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <FaLightbulb className="w-6 h-6 text-[#ffffff]" />
                  <span>Idea</span>
                </motion.button>
              </div>
            </div>
            {/* Overlay para status PERFECT com botão "Show Text" */}
            {status.toUpperCase() === "PERFECT" && (
              <div className="absolute inset-0 flex items-center justify-center z-10 space-x-4">
                <FaCheckCircle className="text-[#53ff1f] w-16 h-16 animate-pulse pointer-events-none" />
                <button
                  onClick={() => setShowTextContent(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#B3BAFF] to-[#9a88ff] text-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
                >
                  <FaEye className="w-6 h-6" />
                  <span className="hidden sm:inline">Show Text</span>
                </button>
              </div>
            )}
          </div>

          {/* Área de feedback */}
          <div
            className="w-full h-[400px] p-6 text-2xl text-[#ffffff] bg-[#B3BAFF] rounded-xl border-none shadow-2xl flex flex-col items-center justify-center"
            onClick={handleWordClick}
          >
            {status ? (
              <>
                {getFeedbackTitle()}
                <p className="text-center text-lg mt-4" dangerouslySetInnerHTML={{ __html: feedback }} />
              </>
            ) : (
              <p className="text-center text-lg text-[#ffffff]">
                Write a text in the left field and click "Check Grammar".{" "}
                <strong>Feedback will appear here.</strong>
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal para exibir o texto corrigido e resumo de correções */}
      {showTextContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-[black] bg-opacity-70 z-50">
          <div className="bg-[#ffffff] text-[#B3BAFF] p-8 rounded-2xl shadow-xl max-w-lg w-full relative animate-fadeIn">
            <button onClick={() => setShowTextContent(false)} className="absolute top-4 right-4 text-[#B3BAFF] hover:text-[#b3bbffa2] transition-colors">
              <FaTimes className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Your Text:</h2>
            {correctionsSummary ? (
              <div>
                <h3 className="text-xl font-bold mb-2">Corrections Summary:</h3>
                <pre className="whitespace-pre-wrap text-lg">{correctionsSummary}</pre>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-lg">{text}</p>
            )}
          </div>
        </div>
      )}

      {/* Popup para definição de palavras */}
      {(isFetchingDefinition || popupContent) && (
        <div
          ref={popupRef}
          className="absolute bg-[#A3A7DF] text-[#626081] p-3 rounded-2xl shadow-2xl flex items-center gap-2"
          style={{ top: popupPosition.y + 25, left: popupPosition.x, minWidth: "120px", transform: "translateX(-50%)" }}
        >
          {isFetchingDefinition ? (
            <>
              <div className="w-4 h-4 border-2 border-[#626081] border-t-transparent rounded-full animate-spin"></div>
              <span>Loading definition...</span>
            </>
          ) : (
            <>
              <strong>{popupContent?.word}:</strong> {popupContent?.definition}
            </>
          )}
        </div>
      )}

      {/* Botão de ação */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4"
      >
        {status.toUpperCase() === "PERFECT" ? (
          <Link href="/">
            <button className="mt-6 px-6 py-3 text-xl bg-[#B3BAFF] hover:bg-[#b3bbff9c] transition-all rounded-xl text-[white] shadow-md flex items-center justify-center gap-2">
              Home
            </button>
          </Link>
        ) : (
          <button
            onClick={handleCheckGrammar}
            className="mt-6 px-6 py-3 text-xl text-[#ffffff] bg-[#B3BAFF] hover:bg-[#b3bbffa2] transition-all rounded-xl shadow-md flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-4 border-[white] border-t-transparent rounded-full animate-spin"></div>
                <span>Generating feedback</span>
              </>
            ) : (
              "Check Grammar"
            )}
          </button>
        )}
      </motion.div>

      {/* Global styles */}
      <style jsx global>{`
        .highlight {
          color: #946dff;
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
          background-color: #946dff;
          transform: scaleX(0);
          transform-origin: left;
          animation: highlight 1s ease-in-out forwards;
        }
        @keyframes highlight {
          to {
            transform: scaleX(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
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
