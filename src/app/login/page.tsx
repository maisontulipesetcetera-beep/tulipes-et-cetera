"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background image with blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-facade.jpg"
          alt="Tulipes EtCetera"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Login card */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.jpg"
            alt="Tulipes EtCetera"
            width={120}
            height={120}
            className="rounded-full object-cover shadow-md"
            priority
          />
        </div>

        {/* Titles */}
        <h1 className="font-heading text-3xl font-bold text-center text-tulipe-bordeaux mb-1">
          Bienvenue
        </h1>
        <p className="font-body text-base text-center text-gray-500 mb-8">
          Connectez-vous à votre espace
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-base font-semibold text-gray-700 mb-2"
            >
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              className="w-full border-2 border-gray-200 focus:border-tulipe-green rounded-xl px-4 py-4 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-base font-semibold text-gray-700 mb-2"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 focus:border-tulipe-green rounded-xl px-4 py-4 pr-12 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 rounded-xl py-3 px-4">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tulipe-green hover:bg-tulipe-green-dark text-white font-body font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-2"
          >
            {loading ? "Connexion en cours…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
