import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "green" | "blue" | "orange" | "gold";
}

const colorClasses = {
  green: {
    circleBg: "bg-green-100",
    iconColor: "text-green-700",
    value: "text-tulipe-green",
  },
  blue: {
    circleBg: "bg-blue-100",
    iconColor: "text-blue-700",
    value: "text-tulipe-green",
  },
  orange: {
    circleBg: "bg-orange-100",
    iconColor: "text-orange-700",
    value: "text-tulipe-green",
  },
  gold: {
    circleBg: "bg-amber-100",
    iconColor: "text-amber-700",
    value: "text-tulipe-green",
  },
};

export default function StatsCard({
  icon: Icon,
  label,
  value,
  color,
}: StatsCardProps) {
  const classes = colorClasses[color];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      {/* Icon circle */}
      <div
        className={`${classes.circleBg} w-12 h-12 rounded-full flex items-center justify-center shrink-0`}
      >
        <Icon size={24} className={classes.iconColor} strokeWidth={2} />
      </div>

      {/* Value + label */}
      <div>
        <p className={`${classes.value} text-4xl font-bold leading-none`}>
          {value}
        </p>
        <p className="text-base text-gray-500 font-medium mt-2">{label}</p>
      </div>
    </div>
  );
}
