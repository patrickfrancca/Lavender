"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { AiOutlineWarning } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setPending(false);
      toast.success(data.message);
      router.push("/sign-in");
    } else {
      setError(data.message);
      setPending(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Vídeo do lado esquerdo */}
      <div className="w-1/2 h-full">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          src="https://v1.pinimg.com/videos/mc/720p/41/a1/65/41a165a8be534ed8e8e8010c8168d621.mp4"
        />
      </div>

      {/* Formulário do lado direito */}
      <div className="w-1/2 bg-[#EBE1EF] flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Sign Up
          </h2>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-8 bg-red-100 border border-red-400 text-red-700 text-sm font-medium p-3 rounded-xl flex items-center gap-2 shadow-md">
              <AiOutlineWarning className="text-red-500 text-lg" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo de Nome/Nickname */}
            <div className="relative mb-6">
              <input
                type="text"
                id="name"
                className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600 placeholder-transparent"
                disabled={pending}
                placeholder="Name or Nickname"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <label
                htmlFor="name"
                className="absolute left-0 -top-3 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600 cursor-text"
              >
                Name or Nickname
              </label>
            </div>

            {/* Campo de Email */}
            <div className="relative mb-6">
              <input
                type="email"
                id="email"
                className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600 placeholder-transparent"
                disabled={pending}
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600 cursor-text"
              >
                Email
              </label>
            </div>

            {/* Campo de Senha */}
            <div className="relative mb-6">
              <input
                type="password"
                id="password"
                className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600 placeholder-transparent"
                disabled={pending}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-purple-600 cursor-text"
              >
                Password
              </label>
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-full font-bold hover:bg-purple-700 transition-all"
              disabled={pending}
            >
              Sign Up
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Botões de Login com Google e GitHub */}
          <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 rounded-full font-bold hover:bg-gray-200 transition-all mb-3">
            <FcGoogle className="text-xl" /> Sign Up with Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-full font-bold hover:bg-gray-800 transition-all">
            <FaGithub className="text-xl" /> Sign Up with GitHub
          </button>

          {/* Já tem conta? */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/sign-in" className="text-purple-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
