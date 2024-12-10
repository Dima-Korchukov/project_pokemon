import { toast, Bounce } from "react-toastify";

const useCustomToast = () => {
  const showToast = (message, options = {}) => {
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      ...options,
    });
  };

  const showSuccessToast = (message) => {
    showToast(message, {
      type: "success",
      autoClose: 3000,
      theme: "colored",
    });
  };

  const showErrorToast = (message) => {
    showToast(message, {
      type: "error",
      autoClose: 4000,
      theme: "colored",
    });
  };

  const showWarningToast = (message) => {
    showToast(message, {
      type: "warning",
      autoClose: 4000,
      theme: "light",
    });
  };

  const showInfoToast = (message) => {
    showToast(message, {
      type: "info",
      autoClose: 4000,
      theme: "light",
    });
  };

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
  };
};

export default useCustomToast;
