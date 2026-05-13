import { Routes, Route } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import LandingPage from "./pages/LandingPage";
import AnalyzerPage from "./pages/AnalyzerPage";

export default function App() {
  const { dark, toggleDark } = useTheme();

  return (
    <div className={dark ? "dark" : ""}>
      <Routes>
        <Route path="/" element={<LandingPage dark={dark} toggleDark={toggleDark} />} />
        <Route path="/analyze" element={<AnalyzerPage dark={dark} toggleDark={toggleDark} />} />
      </Routes>
    </div>
  );
}
