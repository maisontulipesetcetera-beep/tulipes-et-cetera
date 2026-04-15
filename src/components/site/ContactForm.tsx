"use client";

import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const ContactSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court (min. 10 caractères)"),
});

type ContactFields = z.infer<typeof ContactSchema>;

export default function ContactForm() {
  const [fields, setFields] = useState<ContactFields>({
    name: "",
    email: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFields, string>>
  >({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const result = ContactSchema.safeParse(fields);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const newErrors: typeof errors = {};
      for (const key of Object.keys(flat) as (keyof ContactFields)[]) {
        newErrors[key] = flat[key]?.[0];
      }
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website: honeypot }),
      });

      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? "Une erreur est survenue.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError("Impossible de contacter le serveur. Réessayez.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-tulipe-green/10 border border-tulipe-green/30 p-8 text-center">
        <p className="font-heading text-xl text-tulipe-royal mb-2">
          Message envoyé !
        </p>
        <p className="font-body text-gray-600">
          Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>
    );
  }

  const inputCls = (error?: string) =>
    cn(
      "w-full rounded-lg border px-4 py-2.5 font-body text-sm text-gray-800 bg-white outline-none transition-colors focus:border-tulipe-green focus:ring-2 focus:ring-tulipe-green/20",
      error ? "border-red-400" : "border-gray-200",
    );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot */}
      <div aria-hidden="true" className="hidden">
        <input
          tabIndex={-1}
          autoComplete="off"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-gray-700 mb-1">
          Nom complet <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={handleChange}
          className={inputCls(errors.name)}
          placeholder="Marie Dupont"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-gray-700 mb-1">
          Adresse e-mail <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          className={inputCls(errors.email)}
          placeholder="marie@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-gray-700 mb-1">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          name="message"
          value={fields.message}
          onChange={handleChange}
          rows={5}
          className={inputCls(errors.message)}
          placeholder="Votre question ou demande…"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-500 font-body">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 px-6 bg-tulipe-green hover:bg-tulipe-green-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-body font-semibold rounded-xl transition-colors"
      >
        {status === "loading" ? "Envoi en cours…" : "Envoyer"}
      </button>
    </form>
  );
}
