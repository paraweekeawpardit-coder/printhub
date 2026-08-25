interface PageHeadingProps {
  title: string;
}

export default function PageHeading({ title }: PageHeadingProps) {
  return <h1 className="text-lg font-semibold text-slate-900">{title}</h1>;
}

