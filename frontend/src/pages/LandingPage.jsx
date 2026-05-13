import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, BookOpen, Clock, ArrowRight, Shield } from "lucide-react";
import ParticleCanvas from "../components/ParticleCanvas";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: Zap,
    title: "Real-Time Entropy Scoring",
    desc: "Cryptographic information entropy calculated instantly using Shannon's formula. See the exact strength in bits as you type.",
  },
  {
    icon: BookOpen,
    title: "Dictionary Attack Simulation",
    desc: "Checks your password against the top 100,000 most common passwords from real-world data breach leaks.",
  },
  {
    icon: Clock,
    title: "GPU Brute-Force Estimation",
    desc: "Calculates exact crack time using RTX 4090 GPU benchmarks — 100 billion guesses per second.",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function LandingPage({ dark, toggleDark }) {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen relative overflow-hidden ${dark ? "bg-cyber-navy" : "bg-slate-50"}`}>
      <ParticleCanvas dark={dark} />
      <div className={`absolute inset-0 pointer-events-none ${dark ? "bg-cyber-grid" : "bg-cyber-grid-light"}`} />

      <Navbar dark={dark} toggleDark={toggleDark} />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-14 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-8">
            <div
              className={`
              flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono tracking-widest font-semibold
              ${
                dark
                  ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
                  : "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue"
              }
            `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse-slow ${
                  dark ? "bg-cyber-green" : "bg-cyber-blue"
                }`}
              />
              ENTERPRISE SECURITY ANALYSIS
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className={`text-5xl md:text-7xl font-black font-mono leading-[1.05] tracking-tight mb-6 ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            Is Your Password
            <br />
            <span className={dark ? "text-cyber-green glow-text-green" : "text-cyber-blue"}>a Target?</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={`text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10 ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Instantly evaluate password complexity and simulate real-world brute-force and dictionary attacks — powered
            by cryptographic entropy math and GPU benchmarks.
          </motion.p>

          <motion.div variants={fadeUp}>
            <motion.button
              onClick={() => navigate("/analyze")}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`
                inline-flex items-center gap-3 px-8 py-4 rounded-xl
                font-mono font-bold text-base tracking-widest text-white
                cursor-pointer border-none outline-none
                ${
                  dark
                    ? "bg-gradient-to-r from-cyber-green to-cyber-blue shadow-[0_0_40px_rgba(0,255,180,0.35)]"
                    : "bg-gradient-to-r from-cyber-blue to-blue-700 shadow-[0_4px_24px_rgba(0,112,200,0.35)]"
                }
                transition-shadow duration-300
              `}
            >
              <Shield size={18} />
              LAUNCH ANALYZER
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className={`flex items-center justify-center gap-8 mt-12 text-xs font-mono ${
              dark ? "text-slate-600" : "text-slate-400"
            }`}
          >
            {[
              ["100B", "guesses/sec GPU"],
              ["100K", "known passwords"],
              ["94", "max char pool"],
            ].map(([val, label]) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className={`text-xl font-black ${dark ? "text-white" : "text-slate-700"}`}>{val}</span>
                <span className="tracking-wider">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-3 gap-5"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className={`
                rounded-2xl p-6 border transition-all duration-300 group
                ${
                  dark
                    ? "glass-dark hover:border-cyber-green/30 hover:bg-white/[0.06]"
                    : "glass-light hover:border-cyber-blue/30 hover:shadow-lg"
                }
              `}
            >
              <div
                className={`
                w-10 h-10 rounded-xl flex items-center justify-center mb-4
                ${
                  dark
                    ? "bg-cyber-green/10 text-cyber-green group-hover:bg-cyber-green/20"
                    : "bg-cyber-blue/10 text-cyber-blue group-hover:bg-cyber-blue/20"
                }
                transition-colors duration-300
              `}
              >
                <Icon size={20} />
              </div>
              <h3 className={`font-bold text-sm mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
              <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={`text-center text-xs mt-12 ${dark ? "text-slate-700" : "text-slate-300"}`}
        >
          ⚠️ Use test passwords only. Never submit real credentials to any online tool.
        </motion.p>
      </section>
    </div>
  );
}
