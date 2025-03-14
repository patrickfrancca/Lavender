"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Settings, LogIn, UserPlus } from "lucide-react";
import SettingsPopup from "@/components/ui/SettingsPopup/SettingsPopup";

const UserHeader = () => {
  const { data: session } = useSession();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex items-center gap-4">
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
          <span className="text-[#A8AFF5] font-medium">
            Connected as: {session.user?.name}
          </span>
          {/* Linha separadora */}
          <span className="h-[20px] w-[2px] bg-[#a8aff54d]"></span>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-[#A8AFF5] text-white rounded-full shadow-md transition-all duration-300 hover:bg-[#714aff44]"
          >
            <Settings size={22} />
          </button>
          {showSettings && <SettingsPopup onClose={() => setShowSettings(false)} />}
        </>
      )}
    </div>
  );
};

export default UserHeader;
