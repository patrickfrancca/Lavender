"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function WritingPage() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(
    <>{`Write a text in the field on the left and click on "Check Grammar".`} <strong>Feedback will appear here</strong>.</>
  );
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          <h3 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
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
    <div className="flex flex-col items-center justify-center min-h-screen p-16 bg-[#212121] text-[white]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-7xl p-12 bg-[#303030] rounded-xl shadow-3xl text-gray-900"
      >
        <div className="grid grid-cols-2 gap-10">
          <Textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Write as much text as you can in the language you are learning."
            className="w-full h-[400px] p-6 text-2xl text-[#ffffff] bg-[#212121] rounded-xl border-none shadow-2xl focus:ring-0 focus:outline-none"
          />

          <motion.div
            animate={isLoading ? { y: [0, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-full h-[400px] p-6 text-2xl text-[#ffffff] bg-[#181818] rounded-xl border-none shadow-2xl flex flex-col items-center justify-center"
          >
            {status ? (
              <>
                {getFeedbackTitle()}
                <p 
                  className="text-center text-lg mt-4"
                  dangerouslySetInnerHTML={{ __html: feedback }} // Permite renderizar HTML
                />
              </>
            ) : (
              <p className="text-center text-lg text-gray-400">
                Write text in the left field and click &quot;Check Grammar&quot;. <strong>Feedback will appear here.</strong>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      <button
        onClick={handleCheckGrammar}
        className="mt-6 px-6 py-3 text-xl bg-[#303030] hover:bg-[#5b1fa8] transition-all rounded-xl shadow-md flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating feedback...</span>
          </>
        ) : (
          "Check Grammar"
        )}
      </button>

      {/* Adicione o estilo para a classe highlight e a animação */}
      <style jsx global>{`
        .highlight {
          color: #60a5fa; /* Azul */
          font-weight: bold;
          position: relative;
          display: inline-block;
        }

        .highlight::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background-color: #60a5fa; /* Azul */
          transform: scaleX(0);
          transform-origin: left;
          animation: highlight 1s ease-in-out forwards;
        }

        @keyframes highlight {
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}