import MessageInbox from "@/components/admin/MessageInbox";

export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-tulipe-bordeaux mb-6">
        Messages
      </h1>
      <MessageInbox />
    </div>
  );
}
