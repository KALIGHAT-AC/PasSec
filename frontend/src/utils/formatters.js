export function formatBigNumber(n) {
  if (!isFinite(n)) return "∞";
  if (n >= 1e18) return `${(n / 1e18).toFixed(1)} Quintillion`;
  if (n >= 1e15) return `${(n / 1e15).toFixed(1)} Quadrillion`;
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} Trillion`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} Billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} Million`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)} Thousand`;
  return n.toLocaleString();
}

export function scoreToColor(score) {
  const map = {
    Breached: { text: "text-red-400", border: "border-red-500", bg: "bg-red-500/10" },
    Weak: { text: "text-red-400", border: "border-red-500", bg: "bg-red-500/10" },
    Moderate: { text: "text-yellow-400", border: "border-yellow-500", bg: "bg-yellow-500/10" },
    Strong: { text: "text-green-400", border: "border-green-500", bg: "bg-green-500/10" },
    "Very Strong": { text: "text-cyan-400", border: "border-cyan-400", bg: "bg-cyan-400/10" },
  };
  return map[score] ?? map.Weak;
}

export function scoreToVerdict(score, isBreached) {
  if (isBreached || score === "Breached") return { icon: "⚠", label: "COMPROMISED" };
  if (score === "Very Strong") return { icon: "✦", label: "FORTRESS" };
  if (score === "Strong") return { icon: "✓", label: "SECURE" };
  if (score === "Moderate") return { icon: "△", label: "MODERATE" };
  return { icon: "✗", label: "VULNERABLE" };
}

export function localStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

  return {
    score,
    checks,
    label: score === 0 ? "Weak" : labels[score - 1],
    color: score === 0 ? colors[0] : colors[score - 1],
    pct: password.length === 0 ? 0 : Math.max(12, score * 25),
  };
}
