import { mockUsers } from "../data/mockUsers";

/* ---------------- LOGIN ---------------- */
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        resolve({
          token: "fake-jwt-token",
          user,
        });
      } else {
        reject({
          message: "Invalid email or password",
        });
      }
    }, 800);
  });
};

/* ---------------- SIGNUP ---------------- */
export const signupUser = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userExists = mockUsers.find(
        (u) => u.email === userData.email
      );

      if (userExists) {
        reject({
          message: "User already exists",
        });
        return;
      }

      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
      };

      mockUsers.push(newUser); // 👈 fake DB me save

      resolve({
        message: "Signup successful",
        user: newUser,
      });
    }, 800);
  });
};
