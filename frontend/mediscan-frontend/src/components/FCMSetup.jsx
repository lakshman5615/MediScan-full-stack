// src/components/FCMSetup.jsx

import { useEffect, useState } from "react";
import FCMService from "../fcmService";

const FCMSetup = ({ user }) => {
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (user) enableFCM();
  }, [user]);

  const enableFCM = async () => {
    setStatus("loading");
    const ok = await FCMService.initializeFCM();
    setStatus(ok ? "enabled" : "failed");
  };

  if (status === "enabled") {
    return <p>✅ Notifications enabled</p>;
  }

  if (status === "failed") {
    return (
      <button onClick={enableFCM}>
        Enable Medicine Notifications
      </button>
    );
  }

  return <p>🔔 Setting up notifications...</p>;
};

export default FCMSetup;