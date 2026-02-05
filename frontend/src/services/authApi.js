import axios from "./axios";

// -----LOGIN API-----
export const loginUser = (email, password) => {
  return axios.post("/api/auth/login", {
    email,
    password,
  });
}

// -----SIGNUP API-----
export const signupUser = (name, email, age, password) => {
  return axios.post("/api/auth/signup", {
    name,
    email,
    age,
    password,
  });
};