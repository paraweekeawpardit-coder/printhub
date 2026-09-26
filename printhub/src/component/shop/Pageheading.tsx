interface PageHeadingProps {
  title: string;
}

export default function PageHeading({ title }: PageHeadingProps) {
  return (
    <h1 className="text-2xl font-extrabold tracking-tight text-[#0F2942]">
      {title}
    </h1>
  );
}