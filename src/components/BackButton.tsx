// components/BackButton.tsx
import React from "react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  destination?: string;
  label?: string;
  iconPosition?: "left" | "right";
}

const BackButton: React.FC<BackButtonProps> = ({
  destination = "/reading",
  label = "Choose other Story",
  iconPosition = "left",
}) => {
  const router = useRouter();

  // Exemplo com o mesmo ícone usado anteriormente
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

  return (
    <button
      onClick={() => router.push(destination)}
      className="flex items-center px-4 py-2 bg-[#B3BAFF] text-white font-semibold rounded-xl hover:bg-[#a0a5ff77] transition"
    >
      {iconPosition === "left" && <ArrowIcon className="mr-2" />}
      <span>{label}</span>
      {iconPosition === "right" && <ArrowIcon rotate className="ml-2" />}
    </button>
  );
};

export default BackButton;
