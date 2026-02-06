import axios from "./axios";

// -----LOGIN API-----
export const loginUser = (email, password) => {
  return axios.post("/auth/login", {
    email,
    password,
  });
}

// -----SIGNUP API-----
export const signupUser = (name, email, age, password) => {
  return axios.post("/auth/signup", {
    name,
    email,
    age,
    password,
  });
};

// ------Profile Api-------

export const profileUser = (name, email, phone, age) => {
  return axios.post("/auth/profile", {
    name,
    email,
    phone,
    age,
  });
};

