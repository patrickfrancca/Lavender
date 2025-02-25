import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/ui/SettingsPopup/Sidebar";
import ProfileSettings from "@/components/ui/SettingsPopup/ProfileSettings";
import ThemeSettings from "@/components/ui/SettingsPopup/ThemeSettings";
import Logout from "@/components/ui/SettingsPopup/Logout";

interface SettingsPopupProps {
  onClose: () => void;
}

export default function SettingsPopup({ onClose }: SettingsPopupProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "theme" | "logout">("profile");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">

      {/* Motion aplicado ao pop-up */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#EBE1EF] dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-5xl h-[70vh] overflow-hidden flex"
      >

        {/* Barra Lateral */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Conteúdo Principal */}
        <div className="flex-1 p-9 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#A28DB8] dark:text-white">
              {activeTab === "profile" && "Profile Settings"}
              {activeTab === "theme" && "Theme Settings"}
              {activeTab === "logout" && "Logout"}
            </h3>
            <button
              onClick={onClose}
              className="text-[#000] hover:text-[#A28DB8] dark:hover:text-gray-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

          {/* Conteúdo da Aba Ativa */}
          <div>
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "theme" && <ThemeSettings />}
            {activeTab === "logout" && <Logout />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
