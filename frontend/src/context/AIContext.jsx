import { createContext, useContext, useState } from "react";

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);

  const openAIExplanation = (data) => {
    setCurrent(data);
    setHistory((prev) => [data, ...prev]);
  };

  // 🔥 NEW: history item select
  const selectFromHistory = (item) => {
    setCurrent(item);
  };

  return (
    <AIContext.Provider
      value={{
        history,
        current,
        openAIExplanation,
        selectFromHistory, // 👈 expose
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);