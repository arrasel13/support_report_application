import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "./useauth";
// import { useEffect, useState } from "react";

const axiosSecure = axios.create({
  baseURL: "http://localhost:500",
});

const useAxiosSecure = () => {
  // const [errorDetected, setErrorDetected] = useState(false);
  const { logOut } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("__access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    async (error) => {
      const status = error?.response?.status;
      if (status === 500) {
        navigate("/");
      }
      if (status === 401 || status === 403) {
        await logOut();
        // setErrorDetected(true);
        // navigate("/login");
        setTimeout(() => navigate("/signin"), 0);
      }
      return Promise.reject(error);
    }
  );

  // useEffect(() => {
  //   if (errorDetected) {
  //     navigate("/login");
  //   }
  // }, [errorDetected, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
