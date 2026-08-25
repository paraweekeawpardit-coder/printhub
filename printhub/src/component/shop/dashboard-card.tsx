import { ChevronRight, LucideIcon } from "lucide-react";

type Props = {
    title: string;
    value: string;
    subtitle: string;
    icon?: LucideIcon;
};

export default function DashboardCard({ title, value, subtitle }: Props) {
    return (
        <div className="group bg-sky-50 border border-sky-100 rounded-2xl w-72 p-5 relative cursor-pointer hover:border-sky-200 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-slate-700">
                    {title}
                </h3>
                <ChevronRight
                    size={16}
                    className="text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all duration-200"
                />
            </div>

            <p className="text-[#0F2942] text-2xl font-bold mt-4 tracking-tight">
                {value}
            </p>

            <p className="text-slate-400 text-xs mt-2">
                {subtitle}
            </p>
        </div>
    );
}