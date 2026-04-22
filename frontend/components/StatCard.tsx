type StatCardProps = {
  icon: string;
  value: string | number;
  label: string;
  tone?: "default" | "danger" | "success" | "coin";
};

const toneBg: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "var(--night)",
  danger: "#7c1f1f",
  success: "#1f5f2a",
  coin: "#a07a00",
};

export function StatCard({ icon, value, label, tone = "default" }: StatCardProps) {
  return (
    <div className="stat-card" style={{ background: toneBg[tone] }}>
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div className="stat-num">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
