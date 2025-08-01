// utils/toastService.js
import { toast } from "react-toastify";

export const showToast = (type, message, options = {}) => {
  const { icon = undefined, ...restOptions } = options;

  toast(message, {
    type, // success | error | info | warning | default
    icon, // custom icon support (string or JSX)
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    ...restOptions,
  });
};
