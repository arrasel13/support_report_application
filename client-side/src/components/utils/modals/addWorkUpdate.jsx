import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { FaRegCalendarAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useauth";
import useAxiosSecure from "../../../hooks/useaxiossecure";
import { showToast } from "../toasters/toastService";

const AddWorkUpdate = ({ refetch }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [shopifyReview, setShopifyReview] = useState("0");
  const [wpPluginReview, setWpPluginReview] = useState("0");
  const [trustPilotReview, setTrustPilotReview] = useState("0");
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm();

  const closeModal = () => {
    document.getElementById("add_work_update")?.close();
  };

  const onSubmit = async (data) => {
    const formatted = data.report_date
      ? format(data.report_date, "dd-MM-yyyy")
      : "";
    const reportData = {
      ...data,
      report_date: formatted,
      email: user.email,
      name: user.displayName,
    };

    const reportRes = await axiosSecure.post("/addreports", reportData);
    console.log(reportRes.data);

    if (reportRes.data.insertedId) {
      reset();
      closeModal();
      refetch();
      showToast("success", "Work Report successfully added", { icon: "🎉" });
    }

    // console.log(data);
  };

  return (
    <>
      <div className="fixed inset-0 h-full w-full bg-gray-400/60 "></div>
      <div className="modal-box w-8/12 max-w-3xl">
        <h3 className="font-bold text-lg">Work Update</h3>
        <p className="py-4">Submit your daily Work Update</p>

        <div className="modal-action">
          <form
            className="flex flex-col w-full"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">
              <div className="flex flex-col gap-y-5">
                {/* Date Picker */}
                <div className="w-2/3 flex items-center gap-x-4 ">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Select Date
                  </label>
                  <div className="relative">
                    <Controller
                      control={control}
                      {...register("report_date", { required: true })}
                      aria-invalid={errors.report_date ? "true" : "false"}
                      render={({ field }) => (
                        <DatePicker
                          selected={
                            field.value instanceof Date
                              ? field.value
                              : field.value
                              ? new Date(field.value)
                              : null
                          }
                          onChange={(date) => {
                            // Save the Date object to react-hook-form
                            field.onChange(date);
                          }}
                          dateFormat="dd/MM/yyyy"
                          isClearable
                          maxDate={new Date()}
                          placeholderText="Select Date"
                          className="border h-11 pl-10 pr-3 py-2 rounded text-sm focus:outline-none w-full"
                        />
                      )}
                    />
                    <FaRegCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                  {errors.report_date?.type === "required" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      ** Date is required
                    </p>
                  )}
                </div>

                {/* WPDev Ticket reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many WPDeveloper Tickets have you replied today?
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("wpdev_ticket_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.wpdev_ticket_reply ? "true" : "false"
                      }
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.wpdev_ticket_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Storeware Ticket reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many Storeware Tickets have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("storeware_ticket_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.storeware_ticket_reply ? "true" : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.storeware_ticket_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* xCloud ticket reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many xCloud Tickets have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("xcloud_ticket_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.xcloud_ticket_reply ? "true" : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.xcloud_ticket_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* EasyJobs ticket reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many easy.jobs Tickets have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("easyjobs_ticket_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.easyjobs_ticket_reply ? "true" : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.easyjobs_ticket_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Userback feedback reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many Userback feedback have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("userback_reply", { required: true })}
                      aria-invalid={errors.userback_reply ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.userback_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* WPDev Crisp chat reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many WPDeveloper Crisp Chats have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("wpdev_crisp_reply", { required: true })}
                      aria-invalid={errors.wpdev_crisp_reply ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.wpdev_crisp_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* WPDev Crisp Magic Browser Reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many WPDeveloper Crisp Chats have you reached out to
                    today through Magic Browser?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("wpdev_crisp_magic_browser_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.wpdev_crisp_magic_browser_reply
                          ? "true"
                          : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.wpdev_crisp_magic_browser_reply?.type ===
                    "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Storeware Crisp Chat reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many Storeware Crisp Chats have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("storeware_crisp_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.storeware_crisp_reply ? "true" : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.storeware_crisp_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Storeware Crisp magic browser reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many Storeware Crisp Chats have you reached out to today
                    through Magic Browser?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("storeware_crisp_magic_browser_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.storeware_crisp_magic_browser_reply
                          ? "true"
                          : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.storeware_crisp_magic_browser_reply?.type ===
                    "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* xCloud crisp chat reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many xCloud Crisp Chats have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("xcloud_crisp_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.xcloud_crisp_reply ? "true" : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.xcloud_crisp_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* xCloud crisp magic browser reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many xCloud Crisp Chats have you reached out to today
                    through Magic Browser?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("xcloud_crisp_magic_browser_reply", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.xcloud_crisp_magic_browser_reply
                          ? "true"
                          : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.xcloud_crisp_magic_browser_reply?.type ===
                    "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* WP Org threads reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many WordPress.ORG threads have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("wp_org_reply", {
                        required: true,
                      })}
                      aria-invalid={errors.wp_org_reply ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.wp_org_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* FB post reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many Facebook Posts have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("fb_post_reply", {
                        required: true,
                      })}
                      aria-invalid={errors.fb_post_reply ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.fb_post_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* GitHub issue reply */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many GitHub Issues have you replied today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("github_reply", {
                        required: true,
                      })}
                      aria-invalid={errors.github_reply ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.github_reply?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Client issue card create */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many cards on Trello/Fluent Boards/Jira/Clickup have you
                    created today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("client_issue_card", {
                        required: true,
                      })}
                      aria-invalid={errors.client_issue_card ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.client_issue_card?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Client issue card followup */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many cards on Trello/Fluent Boards/Jira/Clickup have you
                    made follow up on today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("client_issue_card_followup", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.client_issue_card_followup ? "true" : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.client_issue_card_followup?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* HS Tickets closed */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many Tickets have you closed today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("hs_ticket_close", {
                        required: true,
                      })}
                      aria-invalid={errors.hs_ticket_close ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.hs_ticket_close?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* HS Ticket Followup */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many tickets have you followed up today?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("hs_ticket_followup", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.hs_ticket_followup ? "true" : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.hs_ticket_followup?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Bulk Client checkup email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Bulk Client Checkup Emails
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("bulk_client_email", {
                        required: true,
                      })}
                      aria-invalid={errors.bulk_client_email ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.bulk_client_email?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Shopify Apps review request Send */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many Review Request Did you send today for Shopify Apps?
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={0}
                      {...register("shopify_app_review", {
                        required: true,
                      })}
                      aria-invalid={
                        errors.shopify_app_review ? "true" : "false"
                      }
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.shopify_app_review?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Shopify Apps review received */}
                <div className="grid grid-cols-2 gap-x-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Reviews did you get today for Shopify Apps?
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        {...register("shopify_app_review_get", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.shopify_app_review_get ? "true" : "false"
                        }
                        onChange={(e) => setShopifyReview(e.target.value)}
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      >
                        <option
                          value="0"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          0
                        </option>
                        <option
                          value="1"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          1
                        </option>
                        <option
                          value="2"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          2
                        </option>
                        <option
                          value="3"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          3
                        </option>
                        <option
                          value="4"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          4
                        </option>
                        <option
                          value="5"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          5
                        </option>
                        <option
                          value="6"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          6
                        </option>
                        <option
                          value="7"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          7
                        </option>
                        <option
                          value="8"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          8
                        </option>
                        <option
                          value="9"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          9
                        </option>
                        <option
                          value="10"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          10
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
                    {errors.shopify_app_review_get?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {shopifyReview !== "0" && (
                    <div>
                      <textarea
                        {...register("shopify_app_review_links", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.shopify_app_review_links ? "true" : "false"
                        }
                        placeholder="Review Links for Shopify Apps. Use Comma for adding multiple links..."
                        rows="6"
                        className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      ></textarea>
                      {errors.shopify_app_review_links?.type === "required" && (
                        <p role="alert" className="text-red-500">
                          This field is required
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* WP plugins review received */}
                <div className="grid grid-cols-2 gap-x-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Reviews did you get today for WordPress plugins?
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        {...register("wporg_review_get", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.wporg_review_get ? "true" : "false"
                        }
                        onChange={(e) => setWpPluginReview(e.target.value)}
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      >
                        <option
                          value="0"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          0
                        </option>
                        <option
                          value="1"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          1
                        </option>
                        <option
                          value="2"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          2
                        </option>
                        <option
                          value="3"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          3
                        </option>
                        <option
                          value="4"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          4
                        </option>
                        <option
                          value="5"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          5
                        </option>
                        <option
                          value="6"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          6
                        </option>
                        <option
                          value="7"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          7
                        </option>
                        <option
                          value="8"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          8
                        </option>
                        <option
                          value="9"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          9
                        </option>
                        <option
                          value="10"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          10
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
                    {errors.wporg_review_get?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {wpPluginReview !== "0" && (
                    <div>
                      <textarea
                        {...register("wporg_review_links", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.wporg_review_links ? "true" : "false"
                        }
                        placeholder="Review Links for WordPress plugins. Use Comma for adding multiple links..."
                        rows="6"
                        className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      ></textarea>
                      {errors.wporg_review_links?.type === "required" && (
                        <p role="alert" className="text-red-500">
                          This field is required
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* TrustPilot Review received */}
                <div className="grid grid-cols-2 gap-x-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Reviews did you get today on TrustPilot?
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        {...register("trustpilot_review_get", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.trustpilot_review_get ? "true" : "false"
                        }
                        onChange={(e) => setTrustPilotReview(e.target.value)}
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      >
                        <option
                          value="0"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          0
                        </option>
                        <option
                          value="1"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          1
                        </option>
                        <option
                          value="2"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          2
                        </option>
                        <option
                          value="3"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          3
                        </option>
                        <option
                          value="4"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          4
                        </option>
                        <option
                          value="5"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          5
                        </option>
                        <option
                          value="6"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          6
                        </option>
                        <option
                          value="7"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          7
                        </option>
                        <option
                          value="8"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          8
                        </option>
                        <option
                          value="9"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          9
                        </option>
                        <option
                          value="10"
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          10
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
                    {errors.trustpilot_review_get?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {trustPilotReview !== "0" && (
                    <div>
                      <textarea
                        {...register("trustpilot_review_links", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.trustpilot_review_links ? "true" : "false"
                        }
                        placeholder="TrustPilot review link/links. Use Comma for adding multiple links..."
                        rows="6"
                        className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      ></textarea>
                      {errors.trustpilot_review_links?.type === "required" && (
                        <p role="alert" className="text-red-500">
                          This field is required
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Customer rating on HS */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many customer ratings did you get on Helpscout today?
                  </label>
                  <div className="relative">
                    <input
                      {...register("hs_ratings", {
                        required: true,
                      })}
                      defaultValue={0}
                      aria-invalid={errors.hs_ratings ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.hs_ratings?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Customer rating on CRISP */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    How many customer ratings did you get on Crisp today?
                  </label>
                  <div className="relative">
                    <input
                      {...register("crisp_ratings", {
                        required: true,
                      })}
                      defaultValue={0}
                      aria-invalid={errors.crisp_ratings ? "true" : "false"}
                      className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  {errors.crisp_ratings?.type === "required" && (
                    <p role="alert" className="text-red-500">
                      This field is required
                    </p>
                  )}
                </div>

                {/* Notes (others task info) */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Notes (others task info)
                  </label>
                  <div className="relative">
                    <textarea
                      {...register("additional_notes")}
                      placeholder="Type your message here..."
                      rows="6"
                      className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-end gap-6 px-2 mt-6 sm:flex-row sm:justify-end">
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
                  Add Work Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddWorkUpdate;
