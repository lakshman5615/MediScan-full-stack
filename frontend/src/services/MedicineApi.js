import axios from "./axios";

// ➕ Add medicine
export const addMedicine = (data) => {
  return axios.post("/medicine/add", data);
};

// 📋 Get all medicines
export const getMedicines = () => {
  return axios.get("/medicine");
};

// ✏️ Update medicine
export const updateMedicine = (id, data) => {
  return axios.put(`/medicine/update/${id}`, data);
};

// 🗑 Delete medicine
export const deleteMedicine = (id) => {
  return axios.delete(`/medicine/delete/${id}`);
};
