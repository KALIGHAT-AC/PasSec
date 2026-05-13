import { useState, useCallback, useRef } from "react";
import axios from "axios";

const API_URL = "/api/analyze-password";

export function usePasswordAnalysis() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const requestEpochRef = useRef(0);

  const analyze = useCallback(async (password) => {
    if (!password?.trim()) return;

    const epoch = ++requestEpochRef.current;

    setStatus("loading");
    setResult(null);
    setError(null);

    try {
      const { data } = await axios.post(API_URL, { password });
      if (epoch !== requestEpochRef.current) return;
      setResult(data);
      setStatus("success");
    } catch (err) {
      if (epoch !== requestEpochRef.current) return;
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Analysis failed. Make sure the backend server is running on port 8000.";
      setError(message);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    requestEpochRef.current += 1;
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { analyze, reset, status, result, error };
}
