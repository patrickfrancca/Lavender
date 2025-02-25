import { Dispatch, SetStateAction } from "react";
import packageJson from '../../../../package.json';
import { User, PaintBucket, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: "profile" | "theme" | "logout";
  setActiveTab: Dispatch<SetStateAction<"profile" | "theme" | "logout">>;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-[#EBE1EF] dark:bg[-gray-700] p-4 border-r border-[#ffffff] dark:border-gray-600">
      <h2 className="text-lg font-semibold text-[#A28DB8] dark:text-white mb-4">Settings</h2>
      <nav className="space-y-1">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center justify-start gap-2 w-full text-left px-4 py-2 rounded-3x1 text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "bg-[#A28DB8] text-[#EBE1EF] rounded-3xl"
              : "text-[#A28DB8] dark:text-gray-300 hover:bg-[#a28db815]  dark:hover:bg-gray-600 rounded-3x1"
          }`}
        >
          <User size={18} /> <span>Profile</span>
        </button>
        <button
          onClick={() => setActiveTab("theme")}
          className={`flex items-center justify-start gap-2 w-full text-left px-4 py-2 rounded-3x1 text-sm font-medium transition-colors ${
            activeTab === "theme"
              ? "bg-[#A28DB8] text-[#EBE1EF] rounded-3xl"
              : "text-[#A28DB8] dark:text-gray-300 hover:bg-[#a28db815]  dark:hover:bg-gray-600 rounded-3xl"
          }`}
        >
          <PaintBucket size={18} /> <span>Theme</span>
        </button>
        <button
          onClick={() => setActiveTab("logout")}
          className={`flex items-center justify-start gap-2 w-full text-left px-4 py-2 rounded-3x1 text-sm font-medium transition-colors ${
            activeTab === "logout"
              ? "bg-[#A28DB8] text-[#EBE1EF] rounded-3xl"
              : "text-[#A28DB8] dark:text-gray-300 hover:bg-[#a28db815]  dark:hover:bg-gray-600 rounded-3xl"
          }`}
        >
          <LogOut size={18} /> <span>Log out</span>
        </button>

        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700">
          App Version: {packageJson.version}
        </div>

      </nav>
    </div>
  );
}