"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type SkillType = {
  id: number;
  name: string;
  description: string;
  href: string;
  image: string;
};

function SkillCard({ skill }: { skill: SkillType }) {
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

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

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

  return (
    <Link href={skill.href} className="relative group block">
      <div
        className="p-6 backdrop-blur-lg rounded-xl border border-[#6900fc15] shadow-glass hover:bg-[#714aff09] transition-all duration-300 text-left min-h-[320px] flex flex-col overflow-hidden"
        ref={cardRef}
      >
        <div
          ref={glowRef}
          className={`absolute w-40 h-40 bg-[#6f00ff]/40 rounded-full blur-3xl opacity-0 transition-opacity duration-200 pointer-events-none will-change-transform ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        <Image
          src={skill.image}
          alt={skill.name}
          width={300}
          height={150}
          className="w-full h-32 object-cover rounded-2xl mb-4 border-4 border-[#714aff09] transition-all duration-300 hover:border-[#714aff44]"
        />
        <h2 className="text-2xl font-bold mb-2 text-[#A28DB8]">{skill.name}</h2>
        <p className="text-[#A28DB8]">{skill.description}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const skills: SkillType[] = [
    {
      id: 1,
      name: "Vocabulary",
      description: "Learn new words every day with our spaced repetition tool using cards.",
      href: "/vocabulary",
      image: "https://i.pinimg.com/originals/c2/05/55/c20555745c54d478f84db4bddcbd599e.gif",
    },
    {
      id: 2,
      name: "Reading",
      description: "Read a story of your choice and improve your written understanding of a language.",
      href: "/reading",
      image: "https://i.pinimg.com/originals/c2/05/55/c20555745c54d478f84db4bddcbd599e.gif",
    },
    {
      id: 3,
      name: "Listening",
      description: "Listen to a story and improve your listening comprehension of what is being said.",
      href: "/listening",
      image: "https://i.pinimg.com/originals/c2/05/55/c20555745c54d478f84db4bddcbd599e.gif",
    },
    {
      id: 4,
      name: "Writing",
      description: "Write a short text and our tool will analyze it and give you feedback.",
      href: "/writing",
      image: "https://i.pinimg.com/originals/c2/05/55/c20555745c54d478f84db4bddcbd599e.gif",
    },
    {
      id: 5,
      name: "Speaking",
      description: "Practice speaking in real-time with an AI to understand real conversations better.",
      href: "/speaking",
      image: "https://i.pinimg.com/originals/c2/05/55/c20555745c54d478f84db4bddcbd599e.gif",
    },
    {
      id: 6,
      name: "Grammar",
      description: "Practice constructing sentences daily to master grammar rules.",
      href: "/grammar",
      image: "https://i.pinimg.com/originals/c2/05/55/c20555745c54d478f84db4bddcbd599e.gif",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EBE1EF] flex flex-col items-center justify-center">
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
