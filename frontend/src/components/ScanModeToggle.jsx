import { useState } from "react";

const ScanModeToggle = ({ mode, setMode }) => {

  const activeClass =
    "flex-1 bg-white rounded-full py-2 text-md font-medium shadow";
  const inactiveClass =
    "flex-1 py-2 text-md text-gray-500";

  return (
    <div className="mt-6 bg-gray-100 rounded-full p-1 flex">

      <button
        onClick={() => setMode("scan")}
        className={mode === "scan" ? activeClass : inactiveClass}
      >
        🔍 Scan Medicine
      </button>

      <button
        onClick={() => setMode("manual")}
        className={mode === "manual" ? activeClass : inactiveClass}
      >
        ⌨ Enter Manually
      </button>

    </div>
  );
};

export default ScanModeToggle;
