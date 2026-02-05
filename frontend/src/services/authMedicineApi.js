import axiosInstance from "./axios";

// 🔐 logged-in IMAGE scan
export const scanSearch = async (data) => {
  const res = await axiosInstance.post(
    "/ai/scan-search",
    data
  );
  return res.data;
};

// 🔐 logged-in MANUAL text
export const manualSearch = async (data) => {
  const res = await axiosInstance.post(
    "/ai/maunal-search",
    data
  );
  return res.data;
};
