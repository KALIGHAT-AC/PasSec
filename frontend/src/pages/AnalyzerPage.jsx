import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Zap, AlertCircle, Loader2, KeyRound, Trash2, Copy, Check } from "lucide-react";
import ParticleCanvas from "../components/ParticleCanvas";
import Navbar from "../components/Navbar";
import StrengthMeter from "../components/StrengthMeter";
import ResultsPanel from "../components/ResultsPanel";
import { usePasswordAnalysis } from "../hooks/usePasswordAnalysis";
import { generateStrongPassword } from "../utils/passwordGeneration";

export default function AnalyzerPage({ dark, toggleDark }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const copyResetRef = useRef(null);
  const { analyze, reset, status, result, error } = usePasswordAnalysis();
  const isLoading = status === "loading";
  const hasResult = status === "success" && result;
  const hasError = status === "error";

  const clearCopyTimer = () => {
    if (copyResetRef.current) {
      clearTimeout(copyResetRef.current);
      copyResetRef.current = null;
    }
  };

  const handlePasswordChange = (e) => {
    clearCopyTimer();
    setCopySuccess(false);
    setPassword(e.target.value);
    if (status !== "idle") reset();
  };

  const handleAnalyze = () => {
    if (!password.trim() || isLoading) return;
    analyze(password);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  const handleGenerateStrong = () => {
    if (isLoading) return;
    clearCopyTimer();
    setCopySuccess(false);
    const next = generateStrongPassword();
    reset();
    setPassword(next);
    analyze(next);
  };

  const handleClear = () => {
    clearCopyTimer();
    setCopySuccess(false);
    reset();
    setPassword("");
    setShowPw(false);
  };

  const handleCopyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopySuccess(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => {
        setCopySuccess(false);
        copyResetRef.current = null;
      }, 1000);
    } catch {
      void 0;
    }
  };

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  const secondaryBtnBase = `
    py-3.5 px-2 sm:px-3 rounded-xl border font-mono font-bold text-[10px] sm:text-xs tracking-[0.08em] sm:tracking-[0.12em]
    flex items-center justify-center gap-2 cursor-pointer outline-none text-center leading-snug
    transition-all duration-300
  `;
  const secondaryBtnDark = `
    bg-white/[0.04] border-white/15 text-slate-200
    hover:bg-white/[0.08] hover:border-cyber-green/40 hover:text-white
    hover:shadow-[0_0_24px_rgba(0,255,180,0.12)]
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/[0.04]
    disabled:hover:border-white/15 disabled:hover:shadow-none
  `;
  const secondaryBtnLight = `
    bg-black/[0.02] border-black/10 text-slate-800
    hover:bg-black/[0.05] hover:border-cyber-blue/45 hover:shadow-[0_4px_20px_rgba(0,112,200,0.12)]
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black/[0.02]
    disabled:hover:border-black/10 disabled:hover:shadow-none
  `;
  const secondaryClearBtnDark = `
    bg-white/[0.04] border-white/15 text-slate-200
    hover:bg-white/[0.08] hover:border-red-400/45 hover:text-white
    hover:shadow-[0_0_24px_rgba(248,113,113,0.18)]
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/[0.04]
    disabled:hover:border-white/15 disabled:hover:shadow-none
  `;
  const secondaryClearBtnLight = `
    bg-black/[0.02] border-black/10 text-slate-800
    hover:bg-black/[0.05] hover:border-red-500/40 hover:shadow-[0_4px_20px_rgba(220,38,38,0.14)]
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black/[0.02]
    disabled:hover:border-black/10 disabled:hover:shadow-none
  `;
  const inputIconBtn = (isCopySuccess) => `
    w-9 h-9 flex items-center justify-center rounded-lg shrink-0
    transition-all duration-300 cursor-pointer outline-none
    focus-visible:ring-2 focus-visible:ring-offset-0
    ${dark ? "focus-visible:ring-cyber-green/45" : "focus-visible:ring-cyber-blue/40"}
    disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none
    ${
      dark
        ? isCopySuccess
          ? "text-green-400 bg-white/[0.06] shadow-[0_0_14px_rgba(34,197,94,0.35)] hover:text-green-300 hover:bg-white/[0.08]"
          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
        : isCopySuccess
          ? "text-green-600 bg-black/[0.04] shadow-[0_0_14px_rgba(22,163,74,0.25)] hover:text-green-700 hover:bg-black/[0.06]"
          : "text-slate-400 hover:text-slate-700 hover:bg-black/5"
    }
  `;

  return (
    <div className={`min-h-screen relative ${dark ? "bg-cyber-navy" : "bg-slate-50"}`}>
      <ParticleCanvas dark={dark} />
      <div className={`absolute inset-0 pointer-events-none ${dark ? "bg-cyber-grid" : "bg-cyber-grid-light"}`} />
      <Navbar dark={dark} toggleDark={toggleDark} />

      <main className="relative z-10 flex flex-col items-center px-4 pt-24 pb-20 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className={`text-xs font-mono tracking-[0.35em] mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            SECURITY ASSESSMENT DASHBOARD
          </div>
          <h1 className={`text-3xl md:text-4xl font-black font-mono ${dark ? "text-white" : "text-slate-900"}`}>
            Attack <span className={dark ? "text-cyber-green" : "text-cyber-blue"}>Simulator</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className={`
            w-full max-w-xl rounded-2xl p-7 border
            ${dark ? "glass-dark" : "glass-light"}
            shadow-2xl
          `}
        >
          <label
            className={`block text-xs font-mono tracking-widest uppercase mb-2 ${
              dark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Enter Password
          </label>

          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter a password to analyze…"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className={`
                w-full pl-4 py-4 pr-[5.25rem] rounded-xl border font-mono text-lg outline-none
                transition-all duration-200
                ${
                  dark
                    ? "bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-cyber-green/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(0,255,180,0.08)]"
                    : "bg-black/[0.03] border-black/[0.08] text-slate-900 placeholder-slate-300 focus:border-cyber-blue/50 focus:shadow-[0_0_0_3px_rgba(0,112,200,0.08)]"
                }
              `}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5" role="presentation">
              <button
                type="button"
                onClick={handleCopyPassword}
                disabled={!password}
                className={inputIconBtn(copySuccess)}
                aria-label={copySuccess ? "Password copied" : "Copy password"}
              >
                {copySuccess ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} />}
              </button>
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className={`
                  w-9 h-9 flex items-center justify-center rounded-lg shrink-0
                  transition-all duration-300 cursor-pointer outline-none
                  focus-visible:ring-2 focus-visible:ring-offset-0
                  ${dark ? "focus-visible:ring-cyber-green/45" : "focus-visible:ring-cyber-blue/40"}
                  ${
                    dark
                      ? "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                      : "text-slate-400 hover:text-slate-700 hover:bg-black/5"
                  }
                `}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StrengthMeter password={password} dark={dark} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleAnalyze}
            disabled={!password.trim() || isLoading}
            whileHover={!password.trim() || isLoading ? {} : { scale: 1.015, y: -1 }}
            whileTap={!password.trim() || isLoading ? {} : { scale: 0.985 }}
            className={`
              mt-5 w-full py-4 rounded-xl border-none outline-none cursor-pointer
              font-mono font-bold text-sm tracking-[0.2em]
              flex items-center justify-center gap-3
              transition-all duration-300
              ${
                !password.trim() || isLoading
                  ? dark
                    ? "bg-white/5 text-slate-600 cursor-not-allowed"
                    : "bg-black/5 text-slate-300 cursor-not-allowed"
                  : dark
                    ? "bg-gradient-to-r from-cyber-green to-cyber-blue text-black shadow-[0_0_30px_rgba(0,255,180,0.3)]"
                    : "bg-gradient-to-r from-cyber-blue to-blue-700 text-white shadow-[0_4px_20px_rgba(0,112,200,0.3)]"
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                RUNNING ATTACK SIMULATIONS…
              </>
            ) : (
              <>
                <Zap size={16} />
                SIMULATE ATTACK
              </>
            )}
          </motion.button>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={handleGenerateStrong}
              disabled={isLoading}
              whileHover={isLoading ? {} : { scale: 1.02, y: -1 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
              className={`${secondaryBtnBase} ${dark ? secondaryBtnDark : secondaryBtnLight}`}
            >
              <KeyRound size={16} className="shrink-0 opacity-90" />
              GENERATE STRONG PASSWORD
            </motion.button>
            <motion.button
              type="button"
              onClick={handleClear}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={`${secondaryBtnBase} ${dark ? secondaryClearBtnDark : secondaryClearBtnLight}`}
            >
              <Trash2 size={16} className="shrink-0 opacity-90" />
              CLEAR
            </motion.button>
          </div>

          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300 leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>{hasResult && <ResultsPanel result={result} dark={dark} />}</AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`mt-8 text-xs text-center max-w-sm leading-relaxed ${dark ? "text-slate-700" : "text-slate-300"}`}
        >
          ⚠️ For project competitions only. Never submit real passwords to any tool. All cryptographic calculations are
          performed server-side.
        </motion.p>
      </main>
    </div>
  );
}
