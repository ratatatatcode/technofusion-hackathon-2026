export default function BadgeComponent({ tag }: { tag: string }) {
  return (
    <div className="h-auto w-auto rounded-lg border px-4 py-2 text-xs font-semibold">{tag}</div>
  );
}
