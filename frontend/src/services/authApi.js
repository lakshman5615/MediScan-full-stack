// import axios from "./axios";

// // -----LOGIN API-----
// export const loginUser = (email, password) => {
//   return axios.post("/auth/login", {
//     email,
//     password,
//   });
// }

// // -----SIGNUP API-----
// export const signupUser = (name, email, phone, age, password) => {
//   return axios.post("/auth/signup", {
//     name,
//     email,
//     phone,
//     age,
//     password,
//   });
// };

// // ------Profile Api-------


// export const getProfile = () => {
//   return axios.get("/auth/profile");
// };


// // export const getProfile = (name, email, phone, age) => {
// //   return axios.get("/auth/profile", {
// //     name,
// //     email,
// //     phone,
// //     age,
// //   });
// // };


import axios from "./axios";

// -----LOGIN API-----
export const loginUser = (email, password) => {
  return axios.post("/auth/login", {
    email,
    password,
  });
}

// -----SIGNUP API-----
export const signupUser = (name, email, phone, age, password) => {
  return axios.post("/auth/signup", {
    name,
    email,
    phone,
    age,
    password,
  });
};

// ------Profile Api-------


export const getProfile = () => {
  return axios.get("/auth/profile");
};


// export const getProfile = (name, email, phone, age) => {
//   return axios.get("/auth/profile", {
//     name,
//     email,
//     phone,
//     age,
//   });
// };


