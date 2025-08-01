import React, { useEffect } from "react";
import Sidebar from "../components/pages/sidebar/sidebar";
import Header from "../components/pages/header/header";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../components/utils/toasters/toastService";

const MainLayout = () => {
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("loginSuccess");
    if (isLoggedIn) {
      console.log("Login success", sessionStorage.getItem("loginSuccess"));
      showToast("success", "Login Success", { icon: "🎉" });

      setTimeout(() => {
        sessionStorage.removeItem("loginSuccess");
      }, 100);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen xl:flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 transition-all duration-300 ease-in-out lg:ml-[290px] ">
          <Header />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            <Outlet />
          </div>
        </div>
      </div>

      <ToastContainer />
      {/* <ToastContainer style={{ top: "10px", zIndex: 99999 }} /> */}

      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ top: "10px", zIndex: 99999 }}
      /> */}
    </>
  );
};

export default MainLayout;
