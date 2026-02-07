import axiosInstance from "./axios";

// 🔓 guest IMAGE scan
export const guestScanSearch = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axiosInstance.post(
    "/api/ai/guest/scan-search",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

// 🔓 guest MANUAL text
export const guestManualSearch = async (data) => {
  const res = await axiosInstance.post(
    "/api/ai/guest/manual-search",
    data
  );
  return res.data;
};
