import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle({ dark, toggleDark }) {
  return (
    <motion.button
      onClick={toggleDark}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={`
        relative w-10 h-10 rounded-full flex items-center justify-center
        transition-all duration-300 cursor-pointer border
        ${dark
          ? "bg-white/5 border-white/10 text-slate-300 hover:text-cyber-green hover:border-cyber-green/40"
          : "bg-black/5 border-black/10 text-slate-500 hover:text-cyber-blue hover:border-cyber-blue/40"
        }
      `}
      aria-label="Toggle theme"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
}
