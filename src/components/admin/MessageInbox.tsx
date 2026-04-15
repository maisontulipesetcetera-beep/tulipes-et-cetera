"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Mail,
  MailOpen,
  CheckCheck,
  Reply,
  ChevronRight,
  X,
  Send,
  Loader2,
} from "lucide-react";

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

const STATUS_LABELS: Record<string, string> = {
  unread: "Non lu",
  read: "Lu",
  replied: "Répondu",
};

const STATUS_COLORS: Record<string, string> = {
  unread: "bg-yellow-100 text-yellow-800",
  read: "bg-gray-100 text-gray-600",
  replied: "bg-green-100 text-green-700",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  unread: Mail,
  read: MailOpen,
  replied: CheckCheck,
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-tulipe-green" size={32} />
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-12rem)] min-h-[500px]">
      {/* List panel */}
      <div className="w-full lg:w-[340px] shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-sm">
            Boîte de réception
          </h2>
          {unreadCount > 0 && (
            <span className="bg-tulipe-green text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>

        {contacts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Aucun message
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {contacts.map((contact) => {
              const Icon = STATUS_ICONS[contact.status];
              const isSelected = selected?.id === contact.id;
              return (
                <li key={contact.id}>
                  <button
                    onClick={() => selectContact(contact)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                      isSelected
                        ? "bg-tulipe-green/5 border-l-2 border-tulipe-green"
                        : ""
                    }`}
                  >
                    <Icon
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        contact.status === "unread"
                          ? "text-yellow-500"
                          : contact.status === "replied"
                            ? "text-green-500"
                            : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-medium truncate ${
                            contact.status === "unread"
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {contact.name}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">
                          {format(new Date(contact.createdAt), "d MMM", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {contact.message}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-gray-300 mt-1 shrink-0"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Detail panel */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden min-w-0">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Sélectionnez un message
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">
                    {selected.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}
                  >
                    {STATUS_LABELS[selected.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{selected.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {format(new Date(selected.createdAt), "d MMMM yyyy à HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setReplying(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-tulipe-green text-white text-sm rounded-lg hover:bg-tulipe-green-dark transition-colors"
                >
                  <Reply size={14} />
                  Répondre
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 lg:hidden"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Message body */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>

              {selected.reply && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Votre réponse :
                  </p>
                  <div className="bg-tulipe-green/5 border border-tulipe-green/20 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selected.reply}
                  </div>
                </div>
              )}

              {success && (
                <p className="mt-3 text-sm text-green-600 font-medium">
                  {success}
                </p>
              )}

              {/* Reply form */}
              {replying && (
                <form onSubmit={sendReply} className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 w-16 shrink-0">
                      Modèle
                    </label>
                    <select
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green"
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

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Objet
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Message
                    </label>
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      required
                      rows={6}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green resize-y"
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex items-center gap-2 px-4 py-2 bg-tulipe-green text-white text-sm rounded-lg hover:bg-tulipe-green-dark disabled:opacity-50 transition-colors"
                    >
                      {sending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      {sending ? "Envoi…" : "Envoyer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplying(false)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
