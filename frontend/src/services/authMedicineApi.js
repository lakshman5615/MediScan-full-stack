import axiosInstance from "./axios";

// 🔐 logged-in IMAGE scan
export const scanSearch = async (data) => {
  const res = await axiosInstance.post(
    "/api/ai/scan-search",
    data
  );
  return res.data;
};

// 🔐 logged-in MANUAL text
export const manualSearch = async (data) => {
  const res = await axiosInstance.post(
    "/api/ai/manual-search",
    data
  );
  return res.data;
};
