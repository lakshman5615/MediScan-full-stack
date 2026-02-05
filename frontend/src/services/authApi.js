import axios from "./axios";

// -----LOGIN API-----
export const loginUser = (email, password) => {
  return axios.post("/auth/login", {
    email,
    password,
  });
}

// -----SIGNUP API-----
export const signupUser = (name, email, age, password , phone) => {
  return axios.post("/auth/signup", {
    name,
    email,
    age,
    password,
    phone
  });
};