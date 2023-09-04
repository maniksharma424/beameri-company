import { toast } from "react-toastify";

export const apiError = (error) =>
  toast.error(error?.response?.data?.message || error?.message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    pauseOnHover: true,
    progress: undefined,
    theme: "light",
  });
