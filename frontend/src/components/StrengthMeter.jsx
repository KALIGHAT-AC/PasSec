import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { localStrength } from "../utils/formatters";

export default function StrengthMeter({ password, dark }) {
  const { checks, label, color, pct } = localStrength(password);
  const empty = !password;

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-black/10"}`}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }}
            initial={{ width: 0 }}
            animate={{ width: empty ? "0%" : `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span
          className="text-xs font-bold font-mono w-20 text-right"
          style={{ color: empty ? "transparent" : color }}
        >
          {empty ? "—" : label.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {[
          { key: "length", label: "8+ Characters" },
          { key: "upper", label: "Uppercase Letter" },
          { key: "digit", label: "Number (0–9)" },
          { key: "symbol", label: "Symbol (!@#…)" },
        ].map(({ key, label: itemLabel }) => {
          const met = checks?.[key] ?? false;
          return (
            <motion.div
              key={key}
              className="flex items-center gap-1.5"
              animate={{ opacity: met ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            >
              {met ? (
                <Check size={13} className="text-green-400 shrink-0" />
              ) : (
                <Circle size={13} className={`shrink-0 ${dark ? "text-white/20" : "text-black/20"}`} />
              )}
              <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{itemLabel}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
