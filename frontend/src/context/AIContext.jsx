import { createContext, useContext, useState, useEffect } from "react";
import { getAIHistory } from "../services/authMedicineApi";

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchHistory();
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getAIHistory();
      setHistory(res.data || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const openAIExplanation = (data) => {
    setCurrent(data);
    setHistory((prev) => [data, ...prev]);
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