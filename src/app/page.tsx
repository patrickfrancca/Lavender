/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Settings, LogIn, UserPlus } from "lucide-react";
import SettingsPopup from "@/components/ui/SettingsPopup/SettingsPopup";
import { phrases } from "@/app/data/phrases";
import { FaCheckCircle } from "react-icons/fa";

type SkillType = {
  id: number;
  name: string;
  description: string;
  href: string;
  image: string;
};

function SkillCard({ skill, disabled = false, countdown = "" }: { skill: SkillType; disabled?: boolean; countdown?: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !glowRef.current) return;
  
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      glowRef.current.style.transform = `translate(${x - 80}px, ${y - 80}px)`;
    };
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setTimeout(() => setIsHovered(false), 0);
    };
  
    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    }
  
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const cardContent = (
    <div
      className={`p-6 backdrop-blur-lg rounded-xl border border-[#b3bbff33] shadow-glass hover:bg-[#714aff09] transition-all duration-300 text-left min-h-[320px] flex flex-col overflow-hidden ${disabled ? "filter blur-sm" : ""}`}
      ref={cardRef}
    >
      <div
        ref={glowRef}
        className={`absolute w-40 h-40 bg-[#a8aff5] rounded-full blur-3xl opacity-0 pointer-events-none will-change-transform ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
      <Image
        src={skill.image}
        alt={skill.name}
        width={300}
        height={150}
        className="w-full h-32 object-cover rounded-2xl mb-4 border-4 border-[#a8aff51a] transition-all duration-300 hover:border-[#a8aff5b0]"
      />
      <h2 className="text-2xl font-bold mb-2 text-[#B3BAFF]">{skill.name}</h2>
      <p className="text-[#B3BAFF]">{skill.description}</p>
    </div>
  );

  if (disabled) {
    return (
      <div className="relative group block">
        {cardContent}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#A8AFF5] bg-opacity-10 rounded-xl">
          <FaCheckCircle className="text-[#A8AFF5] w-16 h-16 animate-pulse" />
          <p className="text-[#A8AFF5] mt-2">Completed for today. Try again in {countdown}</p>
        </div>
      </div>
    );
  } else {
    return (
      <Link href={skill.href} className="relative group block">
        {cardContent}
      </Link>
    );
  }
}

export default function Home() {
  const { data: session } = useSession();
  const [showSettings, setShowSettings] = useState(false);
  const [writingLocked, setWritingLocked] = useState(false);
  const [countdown, setCountdown] = useState("");

  const getDailyPhraseIndex = () => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return dayOfYear % phrases.length;
  };

  const dailyPhrase = phrases[getDailyPhraseIndex()];

  const skills: SkillType[] = [
    {
      id: 1,
      name: "Vocabulary",
      description: "Learn new words every day with our spaced repetition technique using cards.",
      href: "/vocabulary",
      image: "https://i.pinimg.com/originals/6d/3c/fd/6d3cfda6e7bae017c8b264fb3a821e12.gif",
    },
    {
      id: 2,
      name: "Reading",
      description: "Read a story of your choice and improve your written understanding of a language.",
      href: "/reading",
      image: "https://i.pinimg.com/originals/6d/3c/fd/6d3cfda6e7bae017c8b264fb3a821e12.gif",
    },
    {
      id: 3,
      name: "Listening",
      description: "Listen to a story and improve your listening comprehension of what is being said.",
      href: "/listening",
      image: "https://i.pinimg.com/originals/6d/3c/fd/6d3cfda6e7bae017c8b264fb3a821e12.gif",
    },
    {
      id: 4,
      name: "Writing",
      description: "Write a short text and our tool will analyze it and give you feedback.",
      href: "/writing",
      image: "https://i.pinimg.com/originals/6d/3c/fd/6d3cfda6e7bae017c8b264fb3a821e12.gif",
    },
    {
      id: 5,
      name: "Speaking",
      description: "Practice speaking in real-time with an AI to understand real conversations better.",
      href: "/speaking",
      image: "https://i.pinimg.com/originals/6d/3c/fd/6d3cfda6e7bae017c8b264fb3a821e12.gif",
    },
    {
      id: 6,
      name: "Grammar",
      description: "Practice constructing sentences daily to master grammar rules.",
      href: "/grammar",
      image: "https://i.pinimg.com/originals/6d/3c/fd/6d3cfda6e7bae017c8b264fb3a821e12.gif",
    },
  ];

  // Verifica se o módulo Writing foi concluído hoje para o usuário logado
  useEffect(() => {
    function updateLockStatus() {
      if (session && session.user) {
        const userId = session.user.id || session.user.email;
        const storageKey = `writingStatus_${userId}`;
        const stored = localStorage.getItem(storageKey);
        const today = new Date().toISOString().split("T")[0];
        if (stored) {
          try {
            const data = JSON.parse(stored);
            if (data.status === "PERFECT" && data.date === today) {
              setWritingLocked(true);
            } else {
              setWritingLocked(false);
            }
          } catch (error) {
            setWritingLocked(false);
          }
        } else {
          setWritingLocked(false);
        }
      } else {
        setWritingLocked(false);
      }
    }
    updateLockStatus();
    window.addEventListener("storage", updateLockStatus);
    return () => window.removeEventListener("storage", updateLockStatus);
  }, [session]);

  // Atualiza o contador regressivo para a meia-noite
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        {!session ? (
          <>
            <Link
              href="/sign-in"
              className="p-2 bg-[#a8aff5] text-white rounded-xl shadow-md transition-all duration-300 hover:bg-[#b4bcff] flex items-center gap-2"
            >
              <LogIn size={18} /> Log in
            </Link>
            <Link
              href="/sign-up"
              className="p-2 bg-[#a8aff5] text-white rounded-xl shadow-md transition-all duration-300 hover:bg-[#b4bcff] flex items-center gap-2"
            >
              <UserPlus size={18} /> Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="text-[#A8AFF5] font-medium">Connected as: {session.user?.name}</span>
            <span className="h-[20px] w-[2px] bg-[#a8aff54d]"></span>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-[#A8AFF5] text-white rounded-full shadow-md transition-all duration-300 hover:bg-[#714aff44]"
            >
              <Settings size={22} />
            </button>
          </>
        )}
      </div>

      <div className="max-w-7xl w-full px-4 py-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#a8aff5] mb-1 text-center typing-effect">
          {dailyPhrase}
        </h1>
      </div>

      <div className="max-w-7xl w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
          {skills.map((skill) =>
            skill.name === "Writing" && writingLocked ? (
              <SkillCard key={skill.id} skill={skill} disabled={true} countdown={countdown} />
            ) : (
              <SkillCard key={skill.id} skill={skill} />
            )
          )}
        </div>
      </div>

      {showSettings && <SettingsPopup onClose={() => setShowSettings(false)} />}
    </div>
  );
}
