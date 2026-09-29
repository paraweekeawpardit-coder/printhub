import Image from "next/image";

type Props = {
  name: string;
};

export default function CustomerBadge({ name }: Props) {
  return (
    <div className="flex items-center gap-2 bg-sky-100 rounded-full pl-3 pr-1 py-1">
      <span className="text-xs font-medium text-sky-700">
        {name}
      </span>
    </div>
  );
}