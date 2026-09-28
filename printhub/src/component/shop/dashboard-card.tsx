import { ChevronRight, LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  subtitle: string;
  icon?: LucideIcon;
  onClick?: () => void;
  active?: boolean;
};

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
  active,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`group relative w-full cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
        active
          ? "border-sky-500 bg-sky-100/60 shadow-sm"
          : "border-sky-100 bg-sky-50/70 hover:border-sky-300 hover:bg-sky-100/40 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-sky-600" />}
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
        <ChevronRight
          size={16}
          className="text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-sky-600"
        />
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-[#0F2942]">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}