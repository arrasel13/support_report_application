import React, { useState } from "react";
import md5 from "crypto-js/md5";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useauth";
import useAxiosSecure from "../../../hooks/useaxiossecure";
import useAxiosPublic from "../../../hooks/useaxiospublic";
import { showToast } from "../toasters/toastService";

const image_hosting_key = import.meta.env.VITE_WPDEV_imgbb_key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddNewUser = ({ refetch }) => {
  const { createUser, updateCreatedUserProfile, secondayAuthLogout } =
    useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = useForm();

  const closeModal = () => {
    document.getElementById("add_new_user")?.close();
  };

  const onSubmit = async (data) => {
    createUser(data.email, data.password)
      .then(async (result) => {
        const user = result.user;

        let imageFile;
        const selectImage = data.image;
        if (selectImage.length === 0) {
          console.log("Image file not selected");
          const emailHash = md5(data.email.trim().toLowerCase()).toString();
          imageFile = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
          console.log("Image from gravater", imageFile);
        } else {
          const uploadedImg = { image: data.image[0] };
          console.log("Uploaded Image file", uploadedImg);
          const res = await axiosPublic.post(image_hosting_api, uploadedImg, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (res.data.success) {
            imageFile = res.data.data.display_url;
          }
        }

        updateCreatedUserProfile(data.nickname, imageFile).then((res) => {
          console.log("Inside user update profile", res);
          const userInfo = {
            name: data.nickname,
            email: data.email,
            role: data.role,
            image: imageFile,
          };
          console.log("user info from user update profile", userInfo);
          axiosSecure.post("/users", userInfo).then((res) => {
            console.log("From update User Profile: ", res.data);
            if (res.data.insertedId) {
              console.log("User added to the database");
              reset();
              closeModal();
              secondayAuthLogout();
              showToast("success", "User Added successfully", {
                icon: "🎉",
              });
              refetch();
            }
          });
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <div className="fixed inset-0 h-full w-full bg-gray-400/60 "></div>
      <div className="modal-box w-full max-w-lg">
        <h3 className="font-bold text-lg">Add New User</h3>

        <div className="modal-action">
          <form
            className="flex flex-col w-full"
            method="dialog"
            // encType="multipart/form-data"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">
              <div className="flex flex-col gap-x-6 gap-y-5">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      {...register("nickname", { required: true })}
                      aria-invalid={errors.nickname ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="text"
                      placeholder="Nickname"
                    />
                  </div>
                  {errors.nickname?.type === "required" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      Nickname is required
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      {...register("email", { required: true })}
                      aria-invalid={errors.email ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="email"
                      placeholder="Email"
                    />
                  </div>
                  {errors.email?.type === "required" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      Email is required
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password", {
                        required: true,
                        minLength: 6,
                        maxLength: 20,
                        pattern: {
                          value:
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
                        },
                      })}
                      aria-invalid={errors.password ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                  {errors.password?.type === "required" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      Password field is required
                    </p>
                  )}
                  {errors.password?.type === "minLength" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      Password length at least 6 characters
                    </p>
                  )}
                  {errors.password?.type === "maxLength" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      Password length not more than 20 characters
                    </p>
                  )}
                  {errors.password?.type === "pattern" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      Password must need 1 capital, 1 small, 1 number and 1
                      special characters
                    </p>
                  )}
                </div>

                {/* User role */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    User role
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      {...register("role", { required: true })}
                      aria-invalid={errors.role ? "true" : "false"}
                      className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    >
                      <option
                        disabled
                        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                      >
                        --- Select User role ---
                      </option>
                      <option
                        value="superadmin"
                        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                      >
                        Super Admin
                      </option>
                      <option
                        value="admin"
                        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                      >
                        Admin
                      </option>
                      <option
                        value="agent"
                        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                      >
                        Support Agent
                      </option>
                    </select>
                    <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                      <svg
                        className="stroke-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                          stroke=""
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  {errors.role?.type === "required" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      Assign a role for this user
                    </p>
                  )}
                </div>

                {/* Profile Image */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Profile Image
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <input
                      {...register("image")}
                      type="file"
                      className="h-11 w-full file-input file-input-md appearance-none shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-end">
              <div className="flex items-center w-full gap-3 sm:w-auto">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  Add User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewUser;
