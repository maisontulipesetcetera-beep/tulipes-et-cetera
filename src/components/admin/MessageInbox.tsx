"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { X, Send, Loader2 } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "replied";
  reply: string | null;
  createdAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  lang: string;
}

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; emoji: string }
> = {
  unread: {
    label: "Nouveau",
    badgeClass: "bg-red-100 text-red-700 border-red-300",
    emoji: "🔴",
  },
  read: {
    label: "Lu",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-300",
    emoji: "👁",
  },
  replied: {
    label: "Répondu",
    badgeClass: "bg-green-100 text-green-700 border-green-300",
    emoji: "✅",
  },
};

export default function MessageInbox() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchContacts = useCallback(async () => {
    const res = await fetch("/api/messages");
    if (res.ok) {
      const data = await res.json();
      setContacts(data);
    }
    setLoading(false);
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/email-templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch {
      // templates optional
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchTemplates();
  }, [fetchContacts, fetchTemplates]);

  async function markAsRead(contact: Contact) {
    if (contact.status === "unread") {
      await fetch(`/api/messages/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, status: "read" } : c)),
      );
    }
  }

  function selectContact(contact: Contact) {
    setSelected(contact);
    setReplying(false);
    setReplySubject(`Re: Message de ${contact.name}`);
    setReplyBody("");
    setError("");
    setSuccess("");
    markAsRead(contact);
  }

  function applyTemplate(template: EmailTemplate) {
    setReplySubject(template.subject);
    setReplyBody(template.body);
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSending(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/messages/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, body: replyBody }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur lors de l'envoi");
      } else {
        setSuccess("Réponse envoyée avec succès !");
        setReplying(false);
        const updated = await res.json();
        setSelected(updated);
        setContacts((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSending(false);
    }
  }

  const unreadCount = contacts.filter((c) => c.status === "unread").length;

  if (loading) {
    return (
      <div className="bg-white/90 rounded-2xl flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin text-tulipe-green" size={48} />
        <p className="text-xl text-gray-500">Chargement des messages…</p>
      </div>
    );
  }

  // Si un message est sélectionné sur mobile → afficher uniquement le détail
  if (selected) {
    const s = statusConfig[selected.status] ?? {
      label: selected.status,
      badgeClass: "bg-gray-100 text-gray-600 border-gray-300",
      emoji: "•",
    };

    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Bouton retour */}
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 px-5 py-3 bg-white/90 text-gray-700 text-lg font-semibold rounded-xl hover:bg-white transition-colors shadow-sm"
        >
          ← Retour à la liste
        </button>

        {/* Carte message */}
        <div className="bg-white/95 rounded-2xl shadow-sm overflow-hidden">
          {/* En-tête */}
          <div className="px-7 py-6 border-b border-gray-100 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selected.name}
                </h2>
                <span
                  className={`px-4 py-1.5 rounded-xl text-base font-bold border-2 ${s.badgeClass}`}
                >
                  {s.emoji} {s.label}
                </span>
              </div>
              <p className="text-lg text-gray-600">{selected.email}</p>
              <p className="text-base text-gray-400 mt-1">
                {format(new Date(selected.createdAt), "d MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>

          {/* Corps du message */}
          <div className="px-7 py-6 space-y-6">
            <div className="bg-tulipe-beige rounded-xl p-6">
              <p className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Message reçu
              </p>
              <p className="text-xl text-gray-800 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </p>
            </div>

            {selected.reply && !replying && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <p className="text-base font-semibold text-green-700 uppercase tracking-wider mb-3">
                  ✅ Votre réponse
                </p>
                <p className="text-xl text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selected.reply}
                </p>
              </div>
            )}

            {success && (
              <p className="text-xl text-green-600 font-semibold bg-green-50 px-5 py-4 rounded-xl">
                ✅ {success}
              </p>
            )}

            {/* Formulaire de réponse */}
            {replying ? (
              <form onSubmit={sendReply} className="space-y-5">
                <p className="text-xl font-bold text-tulipe-bordeaux">
                  📧 Écrire une réponse
                </p>

                {templates.length > 0 && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Utiliser un modèle (facultatif)
                    </label>
                    <select
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-tulipe-green"
                      onChange={(e) => {
                        const t = templates.find(
                          (t) => t.id === e.target.value,
                        );
                        if (t) applyTemplate(t);
                      }}
                      defaultValue=""
                    >
                      <option value="">— Choisir un modèle —</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Objet de la réponse
                  </label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-tulipe-green"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Votre message
                  </label>
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    required
                    rows={7}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-tulipe-green resize-y"
                  />
                </div>

                {error && (
                  <p className="text-lg text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                    ⚠️ {error}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-3 px-7 py-4 bg-tulipe-green text-white text-xl font-bold rounded-xl hover:bg-tulipe-green-dark disabled:opacity-50 transition-colors min-h-[60px]"
                  >
                    {sending ? (
                      <Loader2 size={22} className="animate-spin" />
                    ) : (
                      <Send size={22} />
                    )}
                    {sending ? "Envoi en cours…" : "Envoyer la réponse"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplying(false)}
                    className="flex items-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 text-xl font-semibold rounded-xl hover:bg-gray-100 transition-colors min-h-[60px]"
                  >
                    <X size={20} /> Annuler
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => {
                  setReplying(true);
                  setError("");
                  setSuccess("");
                }}
                className="flex items-center gap-3 px-8 py-4 bg-tulipe-bordeaux text-white text-xl font-bold rounded-xl hover:bg-tulipe-bordeaux/90 transition-colors shadow-sm min-h-[60px]"
              >
                📧 Répondre à ce message
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Liste des messages
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-7 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-tulipe-bordeaux">
            Boîte de réception
          </h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-lg font-bold rounded-full px-4 py-1 min-w-[36px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white/90 rounded-2xl py-20 text-center">
          <p className="text-2xl text-gray-400">Aucun message pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => {
            const s = statusConfig[contact.status] ?? {
              label: contact.status,
              badgeClass: "bg-gray-100 text-gray-600 border-gray-300",
              emoji: "•",
            };

            return (
              <button
                key={contact.id}
                onClick={() => selectContact(contact)}
                className={`w-full text-left bg-white/95 rounded-2xl px-6 py-5 shadow-sm border-2 transition-all hover:shadow-md hover:border-tulipe-green/40 ${
                  contact.status === "unread"
                    ? "border-orange-200"
                    : "border-gray-100"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <p className="text-xl font-bold text-gray-900">
                        {contact.name}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-xl text-base font-bold border-2 ${s.badgeClass}`}
                      >
                        {s.emoji} {s.label}
                      </span>
                    </div>
                    <p className="text-lg text-gray-500 truncate">
                      {contact.message}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base text-gray-400">
                      {format(new Date(contact.createdAt), "d MMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                    <p className="text-base text-tulipe-green font-semibold mt-1">
                      Voir →
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
