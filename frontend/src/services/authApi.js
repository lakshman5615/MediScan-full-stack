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

const AUTH_PATHS = ["/auth", "/api/auth"];

const postAuthWithFallback = async (path, payload) => {
  let lastError;

  for (const base of AUTH_PATHS) {
    try {
      return await axios.post(`${base}${path}`, payload);
    } catch (error) {
      if (error?.response?.status !== 404) {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError || new Error("Auth endpoint not found");
};

const getAuthWithFallback = async (path) => {
  let lastError;

  for (const base of AUTH_PATHS) {
    try {
      return await axios.get(`${base}${path}`);
    } catch (error) {
      if (error?.response?.status !== 404) {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError || new Error("Auth endpoint not found");
};

// -----LOGIN API-----
export const loginUser = (email, password) => {
  return postAuthWithFallback("/login", {
    email,
    password,
  });
}

// -----SIGNUP API-----
export const signupUser = (name, email, phone, age, password) => {
  return postAuthWithFallback("/signup", {
    name,
    email,
    phone,
    age,
    password,
  });
};

// ------Profile Api-------


export const getProfile = () => {
  return getAuthWithFallback("/profile");
};


// export const getProfile = (name, email, phone, age) => {
//   return axios.get("/auth/profile", {
//     name,
//     email,
//     phone,
//     age,
//   });
// };


