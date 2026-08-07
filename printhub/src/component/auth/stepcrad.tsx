import { ReactNode } from "react";

type StepCardProps = {
  icon: ReactNode;
  title: string;
  desc: string;
};

export default function StepCard({ icon, title, desc }: StepCardProps) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:border-gray-200 hover:shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-navy">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}