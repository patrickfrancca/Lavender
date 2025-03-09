import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <div>
      <p>Are you sure you want to log out?</p>
      <button
        onClick={() => signOut({ callbackUrl: "/sign-in" })}
        className="flex items-center justify-start gap-2 bg-[#A8AFF5] text-[#ffffff] py-1 px-4 rounded-2xl mt-4 shadow-xl hover:bg-[#a8aff59d] duration-200"
      >
        <LogOut size={18} /> <span>Log out</span>
      </button>
    </div>
  );
}