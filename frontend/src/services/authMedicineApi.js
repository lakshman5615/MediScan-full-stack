

import axiosInstance from "./axios";

// 🔐 logged-in IMAGE scan
export const scanSearch = async (file) => {
  const formData = new FormData();
  formData.append("image", file); // 👈 MUST be "image"

  const res = await axiosInstance.post(
    "/api/ai/scan-search",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
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