"use client";
import { useState } from "react";

function SkillCard({ skill }: { skill: any }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={skill.href}
      className="relative group block p-6 backdrop-blur-lg rounded-xl border border-[#cfcad615] shadow-glass hover:bg-[#714aff09] transition-all duration-300 text-left min-h-[300px] flex flex-col overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="absolute w-40 h-40 bg-[#6f00ff]/40 rounded-full blur-3xl opacity-100 transition-all duration-100 ease-out pointer-events-none"
          style={{
            top: `${mousePosition.y}px`,
            left: `${mousePosition.x}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <img
        src={skill.image}
        alt={skill.name}
        className="w-full h-32 object-cover rounded-lg mb-4"
      />
      <h2 className="text-2xl font-bold mb-2 text-white">{skill.name}</h2>
      <p className="text-gray-300">{skill.description}</p>
    </a>
  );
}

export default function Home() {
  const skills = [
    { id: 1, name: "Vocabulary", description: "Learn new words every day with our spaced repetition tool using cards.", href: "/vocabulary", image: "https://i.pinimg.com/originals/bd/e3/e1/bde3e16f060043de9e2ebc624fb64049.gif" },
    { id: 2, name: "Reading", description: "Read a story of your choice and improve your written understanding of a language.", href: "/reading", image: "https://i.pinimg.com/originals/bd/e3/e1/bde3e16f060043de9e2ebc624fb64049.gif" },
    { id: 3, name: "Listening", description: "Listen to a story and improve your listening comprehension of what is being said.", href: "/listening", image: "https://i.pinimg.com/originals/bd/e3/e1/bde3e16f060043de9e2ebc624fb64049.gif" },
    { id: 4, name: "Writing", description: "Write a short text and our tool will analyze it and give you feedback.", href: "/writing", image: "https://i.pinimg.com/originals/bd/e3/e1/bde3e16f060043de9e2ebc624fb64049.gif" },
    { id: 5, name: "Speaking", description: "Practice speaking in real-time with an AI to understand real conversations better.", href: "/speaking", image: "https://i.pinimg.com/originals/bd/e3/e1/bde3e16f060043de9e2ebc624fb64049.gif" },
    { id: 6, name: "Grammar", description: "Practice constructing sentences daily to master grammar rules.", href: "/grammar", image: "https://i.pinimg.com/originals/bd/e3/e1/bde3e16f060043de9e2ebc624fb64049.gif" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0217] flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}
