import axiosInstance from "./axios";

// 🔓 guest IMAGE scan
export const guestScanSearch = async (data) => {
  const res = await axiosInstance.post(
    "/api/ai/guest/scan-search",
    data
  );
  return res.data;
};

// 🔓 guest MANUAL text
export const guestManualSearch = async (data) => {
  const res = await axiosInstance.post(
    "/api/ai/guest/maunal-search",
    data
  );
  return res.data;
};
