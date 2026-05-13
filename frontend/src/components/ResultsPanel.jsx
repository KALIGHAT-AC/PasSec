import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Clock, Zap, BookOpen, Lightbulb } from "lucide-react";
import { scoreToColor, scoreToVerdict, formatBigNumber } from "../utils/formatters";

function StatCard({ label, value, icon: Icon, dark }) {
  return (
    <div
      className={`
      rounded-xl p-4 border
      ${
        dark ? "bg-white/[0.03] border-white/[0.08]" : "bg-black/[0.02] border-black/[0.07]"
      }
    `}
    >
      <div
        className={`flex items-center gap-1.5 mb-2 text-xs font-mono tracking-widest uppercase ${
          dark ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {Icon && <Icon size={12} />}
        {label}
      </div>
      <div className={`font-mono font-bold text-base leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}

function DictionaryBadge({ breached, dark }) {
  return (
    <div
      className={`
      flex items-start gap-3 rounded-xl p-4 border
      ${
        breached
          ? "bg-red-500/10 border-red-500/30"
          : "bg-green-500/10 border-green-500/30"
      }
    `}
    >
      <div className="mt-0.5">
        {breached ? (
          <ShieldAlert size={20} className="text-red-400" />
        ) : (
          <ShieldCheck size={20} className="text-green-400" />
        )}
      </div>
      <div>
        <div className={`text-sm font-bold mb-0.5 ${breached ? "text-red-400" : "text-green-400"}`}>
          Dictionary Attack — {breached ? "MATCH FOUND" : "No Match"}
        </div>
        <div className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {breached
            ? "COMPROMISED: This exact password appears in top common-breach lists. Change it immediately everywhere you’ve used it."
            : "Not found in the top 100,000 most common passwords. Good — you avoided the easy targets."}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPanel({ result, dark }) {
  const {
    overall_score,
    dictionary_attack,
    brute_force_attack,
    entropy_bits,
    pool_size,
    recommendations,
    has_lowercase,
    has_uppercase,
    has_digits,
    has_symbols,
  } = result;

  const isBreached = dictionary_attack.breached;
  const colors = scoreToColor(overall_score);
  const verdict = scoreToVerdict(overall_score, isBreached);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const charsets = [
    { label: "Lowercase a–z", active: has_lowercase, value: 26 },
    { label: "Uppercase A–Z", active: has_uppercase, value: 26 },
    { label: "Digits 0–9", active: has_digits, value: 10 },
    { label: "Symbols !@#…", active: has_symbols, value: 32 },
  ];

  return (
    <motion.div
      className="mt-8 space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={itemVariants}
        className={`rounded-2xl border-2 p-6 text-center ${colors.border} ${colors.bg}`}
        style={{ boxShadow: `0 0 40px ${isBreached ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.1)"}` }}
      >
        <div className={`text-xs font-mono tracking-[0.3em] mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>
          SECURITY VERDICT
        </div>
        <div
          className={`text-4xl font-black font-mono tracking-wider mb-2 ${colors.text}`}
          style={{ textShadow: `0 0 30px currentColor` }}
        >
          {verdict.icon} {verdict.label}
        </div>
        <div className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {isBreached ? (
            <span className="text-red-400 font-semibold">
              Change it immediately — this password is found in common breach lists.
            </span>
          ) : (
            <>
              Overall score: <span className={`font-semibold ${colors.text}`}>{overall_score}</span>
              {" · "}
              {entropy_bits} bits of entropy
            </>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <StatCard label="Entropy" value={`${entropy_bits} bits`} icon={Zap} dark={dark} />
        <StatCard label="Char Pool" value={`${pool_size} chars`} icon={BookOpen} dark={dark} />
        <StatCard label="Combinations" value={formatBigNumber(brute_force_attack.combinations)} icon={null} dark={dark} />
        <StatCard label="Time to Crack" value={brute_force_attack.human_readable_time} icon={Clock} dark={dark} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className={`rounded-xl border p-4 ${
          dark ? "bg-white/[0.03] border-white/[0.08]" : "bg-black/[0.02] border-black/[0.07]"
        }`}
      >
        <div
          className={`text-xs font-mono tracking-widest uppercase mb-3 ${
            dark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Character Pool Breakdown
        </div>
        <div className="space-y-2">
          {charsets.map(({ label, active, value }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    active ? "bg-green-400" : dark ? "bg-white/10" : "bg-black/10"
                  }`}
                />
                <span
                  className={`text-xs ${
                    active
                      ? dark
                        ? "text-slate-300"
                        : "text-slate-700"
                      : dark
                        ? "text-slate-600"
                        : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              <span
                className={`text-xs font-mono ${
                  active
                    ? dark
                      ? "text-white"
                      : "text-slate-900"
                    : dark
                      ? "text-slate-600"
                      : "text-slate-400"
                }`}
              >
                +{value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DictionaryBadge breached={isBreached} dark={dark} />
      </motion.div>

      {recommendations?.length > 0 && (
        <motion.div
          variants={itemVariants}
          className={`rounded-xl border p-4 ${
            dark ? "bg-white/[0.03] border-white/[0.08]" : "bg-black/[0.02] border-black/[0.07]"
          }`}
        >
          <div
            className={`flex items-center gap-2 text-xs font-mono tracking-widest uppercase mb-4 ${
              dark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <Lightbulb size={12} />
            Security Recommendations
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span
                  className={`shrink-0 font-mono font-bold ${
                    dark ? "text-cyber-green" : "text-cyber-blue"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={dark ? "text-slate-300" : "text-slate-600"}>{rec}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
