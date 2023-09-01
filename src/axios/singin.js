import { isAutheticated } from "../utils/auth";
import { Axios } from "./axios";
const { token } = isAutheticated();

export const signin = async ({ ...data }) => {
  return Axios.post("/auth/signin", data);
};
export const updatePassword = async ({ ...data }) => {
  return Axios.post("/user/update-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const forgotPassword = async ({ ...data }) => {
  return Axios.post("/user/forgot-password", data, {
    headers: {
      // Authorization: `Bearer ${token}`,
    },
  });
};
export const verifyOTP = async ({ ...data }) => {
  return Axios.post("/user/verify-otp", data, {
    headers: {
      // Authorization: `Bearer ${token}`,
    },
  });
};
export const resetPassword = async ({ ...data }) => {
  return Axios.post("/user/reset-password", data, {
    headers: {
      // Authorization: `Bearer ${token}`,
    },
  });
};
