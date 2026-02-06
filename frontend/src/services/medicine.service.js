import axiosInstance from "./axios";

/* ADD MEDICINE */
export const addMedicine = async (data) => {
  const res = await axiosInstance.post("/medicine/add", data);
  return res.data;
};

/* GET ALL MEDICINES */
export const getMedicines = async (params = {}) => {
  const res = await axiosInstance.get("/medicine", { params });
  return res.data;
};

/* GET SINGLE MEDICINE */
export const getMedicineById = async (id) => {
  const res = await axiosInstance.get(`/medicine/${id}`);
  return res.data;
};

/* UPDATEyeh MEDICINE */
export const updateMedicine = async (id, data) => {
  const res = await axiosInstance.put(`/medicine/update/${id}`, data);
  return res.data;
};

/* DELETE MEDICINE */
export const deleteMedicine = async (id) => {
  const res = await axiosInstance.delete(`/medicine/delete/${id}`);
  return res.data;
};

/* MARK DOSE TAKEN */
export const markDoseTaken = async (id, scheduledTime) => {
  const res = await axiosInstance.post(`/medicine/taken/${id}`, {
    scheduledTime,
  });
  return res.data;
};

/* MARK DOSE MISSED */
export const markDoseMissed = async (id, scheduledTime) => {
  const res = await axiosInstance.post(`/medicine/missed/${id}`, {
    scheduledTime,
  });
  return res.data;
};
