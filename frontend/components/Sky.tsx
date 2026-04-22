export function Sky({ full = false }: { full?: boolean }) {
  return (
    <div className="sky">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      {full ? <div className="cloud cloud-3" /> : null}
      {full ? <div className="hill hill-1" /> : null}
      {full ? <div className="hill hill-2" /> : null}
      {full ? <div className="bush bush-1" /> : null}
      {full ? <div className="bush bush-2" /> : null}
    </div>
  );
}
