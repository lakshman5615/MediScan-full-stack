import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAIHistory } from "../services/authMedicineApi";

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await getAIHistory();
      const historyList = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.history)
            ? res.history
            : [];

      setHistory(historyList);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchHistory();
    }
  }, [fetchHistory]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const refreshHistory = () => fetchHistory();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchHistory();
      }
    };

    const intervalId = setInterval(refreshHistory, 10000);

    window.addEventListener("focus", refreshHistory);
    window.addEventListener("ai:history:updated", refreshHistory);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", refreshHistory);
      window.removeEventListener("ai:history:updated", refreshHistory);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchHistory]);

  const openAIExplanation = (data) => {
    setCurrent(data);
    setHistory((prev) => [data, ...prev]);
    window.dispatchEvent(new Event("ai:history:updated"));
    fetchHistory();
  };

  const selectFromHistory = (item) => {
    setCurrent(item);
  };

  return (
    <AIContext.Provider
      value={{
        history,
        current,
        openAIExplanation,
        selectFromHistory,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
