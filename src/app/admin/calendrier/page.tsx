import CalendarView from "@/components/admin/CalendarView";

export default function CalendrierPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-tulipe-blue">
          📅 Calendrier
        </h1>
      </div>

      {/* Calendrier */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-6 shadow-sm">
        <CalendarView />
      </div>
    </div>
  );
}
