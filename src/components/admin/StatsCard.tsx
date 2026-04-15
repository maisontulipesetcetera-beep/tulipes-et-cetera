interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: "green" | "blue" | "orange" | "red";
}

const colorClasses = {
  green: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-700",
    value: "text-green-700",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-700",
    value: "text-blue-700",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "bg-orange-100 text-orange-700",
    value: "text-orange-700",
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-100 text-red-700",
    value: "text-red-700",
  },
};

export default function StatsCard({
  icon,
  label,
  value,
  color,
}: StatsCardProps) {
  const classes = colorClasses[color];

  return (
    <div
      className={`${classes.bg} rounded-xl p-5 flex items-center gap-4 shadow-sm`}
    >
      <div
        className={`${classes.icon} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className={`${classes.value} text-2xl font-bold leading-tight`}>
          {value}
        </p>
        <p className="text-sm text-gray-600 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
