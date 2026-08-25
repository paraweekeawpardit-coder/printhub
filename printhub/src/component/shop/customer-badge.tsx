import Image from "next/image";

type Props = {
  name: string;
  avatar: string;
};

export default function CustomerBadge({ name, avatar }: Props) {
  return (
    <div className="flex items-center gap-2 bg-sky-100 rounded-full pl-3 pr-1 py-1">
      <span className="text-xs font-medium text-sky-700">
        {name}
      </span>
      <Image
        src={avatar || "/avatar.png"}
        alt=""
        width={26}
        height={26}
        className="rounded-full"
      />
    </div>
  );
}