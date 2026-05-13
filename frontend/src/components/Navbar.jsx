import { Link, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ dark, toggleDark }) {
  const location = useLocation();
  const isAnalyzer = location.pathname === "/analyze";

  return (
    <nav
      className={`
      fixed top-0 left-0 right-0 z-50 h-14
      flex items-center justify-between px-6
      ${
        dark
          ? "bg-cyber-navy/80 border-b border-white/5"
          : "bg-white/80 border-b border-black/5"
      }
      backdrop-blur-xl
    `}
    >
      <Link to="/" className="flex items-center gap-2 no-underline">
        <ShieldCheck size={22} className={dark ? "text-cyber-green" : "text-cyber-blue"} />
        <span
          className={`
          font-mono font-bold text-sm tracking-widest
          ${dark ? "text-white" : "text-slate-900"}
        `}
        >
          PASS<span className={dark ? "text-cyber-green" : "text-cyber-blue"}>SEC</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {isAnalyzer && (
          <Link
            to="/"
            className={`
              text-sm font-medium transition-colors
              ${dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}
            `}
          >
            ← Home
          </Link>
        )}
        {!isAnalyzer && (
          <Link
            to="/analyze"
            className={`
              text-sm font-medium transition-colors
              ${
                dark
                  ? "text-slate-400 hover:text-cyber-green"
                  : "text-slate-500 hover:text-cyber-blue"
              }
            `}
          >
            Analyzer
          </Link>
        )}
        <ThemeToggle dark={dark} toggleDark={toggleDark} />
      </div>
    </nav>
  );
}
