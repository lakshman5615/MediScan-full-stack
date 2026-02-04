import { createContext, useContext, useState } from "react";

const CabinetContext = createContext();

export const CabinetProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  const addMedicine = (medicine) => {
    setMedicines((prev) => [...prev, medicine]);
  };

  return (
    <CabinetContext.Provider value={{ medicines, addMedicine }}>
      {children}
    </CabinetContext.Provider>
  );
};

export const useCabinet = () => useContext(CabinetContext);
