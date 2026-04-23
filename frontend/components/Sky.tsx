export function Sky({ full = false }: { full?: boolean }) {
  return (
    <div className="sky mt-15">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      {full ? <div className="cloud cloud-3" /> : null}
    </div>
  );
}
