interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: "green" | "blue" | "orange" | "gold";
}

const colorClasses = {
  green: {
    bg: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    value: "text-green-800",
  },
  blue: {
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    value: "text-blue-800",
  },
  orange: {
    bg: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
    value: "text-orange-800",
  },
  gold: {
    bg: "bg-yellow-50 border-yellow-200",
    iconBg: "bg-yellow-100",
    value: "text-yellow-800",
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
      className={`${classes.bg} border-2 rounded-2xl p-8 flex flex-col gap-4 shadow-sm min-h-[140px]`}
    >
      <div
        className={`${classes.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className={`${classes.value} text-5xl font-bold leading-none`}>
          {value}
        </p>
        <p className="text-xl text-gray-700 font-medium mt-2">{label}</p>
      </div>
    </div>
  );
}
