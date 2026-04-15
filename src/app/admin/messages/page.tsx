import MessageInbox from "@/components/admin/MessageInbox";

export default function MessagesPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-tulipe-blue">
          💬 Messages
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          Les personnes qui vous ont écrit depuis le site
        </p>
      </div>
      <MessageInbox />
    </div>
  );
}
