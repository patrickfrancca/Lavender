"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AiOutlineWarning } from "react-icons/ai";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
      toast.success("Login successful");
    } else if (res?.status === 401) {
      setError("Invalid credentials");
      setPending(false);
    } else {
      setError("Something went wrong");
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" });
  };

  return (
    <div className="flex h-screen">
      {/* GIF no lado esquerdo */}
      <div className="w-1/2 h-full">
        <img
          src="https://i.pinimg.com/originals/c2/05/55/c20555745c54d478f84db4bddcbd599e.gif"
          alt="Login animation"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulário do lado direito */}
      <div className="w-1/2 bg-[#EBE1EF] flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h2>

          {error && (
            <div className="mb-8 bg-red-100 border border-red-400 text-red-700 text-sm font-medium p-3 rounded-xl flex items-center gap-2 shadow-md">
              <AiOutlineWarning className="text-red-500 text-lg" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo de Email */}
            <div className="relative mb-4">
              <input
                type="email"
                disabled={pending}
                className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600 placeholder-transparent"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="absolute left-0 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-purple-600">
                Email
              </label>
            </div>

            {/* Campo de Senha */}
            <div className="relative mb-6">
              <input
                type="password"
                disabled={pending}
                className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600 placeholder-transparent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="absolute left-0 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-purple-600">
                Password
              </label>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-full font-bold hover:bg-purple-700 transition-all"
              disabled={pending}
            >
              Login
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Botões de Login com Google e GitHub */}
          <button 
          disabled={false}
          onClick={(e) => handleProvider(e, "google")}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 rounded-full font-bold hover:bg-gray-200 transition-all mb-3">
            <FcGoogle className="text-xl" /> Login with Google
          </button>
          <button
            disabled={false}
            onClick={(e) => handleProvider(e, "github")}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-full font-bold hover:bg-gray-800 transition-all">
            <FaGithub className="text-xl" /> Login with GitHub
          </button>

          {/* Criar nova conta */}
          <p className="text-center text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-purple-600 hover:underline">
              Create new account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
