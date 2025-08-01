import { TiArrowBack } from "react-icons/ti";
import { Link, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useaxiossecure";
import { useQuery } from "@tanstack/react-query";

const EditWorkupdate = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const { data: singleReportData = [] } = useQuery({
    queryKey: ["singleReportData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reportById", {
        params: { id },
      });
      return res.data;
    },
    onSuccess: (data) => {
      reset(data);
    },
  });

  // console.log(singleReportData);
  // console.log("Single Report Data: ", singleReportData);

  const [shopifyReview, setShopifyReview] = useState(
    singleReportData.shopify_app_review_get
  );
  const [wpPluginReview, setWpPluginReview] = useState(
    singleReportData.wporg_review_get
  );
  const [trustPilotReview, setTrustPilotReview] = useState(
    singleReportData.trustpilot_review_get
  );

  // Sync state from singleReportData once it's loaded
  useEffect(() => {
    if (singleReportData?.shopify_app_review_get !== undefined) {
      setShopifyReview(singleReportData.shopify_app_review_get.toString());
    }
    if (singleReportData?.wporg_review_get !== undefined) {
      setWpPluginReview(singleReportData.wporg_review_get.toString());
    }
    if (singleReportData?.trustpilot_review_get !== undefined) {
      setTrustPilotReview(singleReportData.trustpilot_review_get.toString());
    }
  }, [singleReportData]);

  const onSubmit = async (updateData) => {
    console.log("Submitted Updated data: ", updateData);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Link to="/workUpdate">
              <TiArrowBack className="w-5 h-5 cursor-pointer" />
            </Link>
            <span>Edit Work Update: {id}</span>
          </div>
        </div>

        {/* Edited Data */}
        <div>
          <form
            className="flex flex-col w-full"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="custom-scrollbar h-[700px] overflow-y-auto px-2 py-4">
              {/* <div className="flex flex-col gap-y-5"> */}
              <div className="grid grid-cols-2 gap-8">
                {/* Date Picker */}
                <div className="w-2/3 flex items-center gap-x-4 col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Select Date
                  </label>
                  <div className="relative">
                    <DatePicker
                      {...register("report_date", { required: true })}
                      selected={singleReportData.report_date}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd-mm-yyyy"
                      className="border h-11 pl-10 pr-3 py-2 rounded text-sm focus:outline-none w-full"
                    />
                    {/* <Controller
                      control={control}
                      {...register("report_date", { required: true })}
                      aria-invalid={errors.report_date ? "true" : "false"}
                      render={({ field }) => (
                        <DatePicker
                          selected={
                            field.value ??
                            (singleReportData?.report_date
                              ? new Date(singleReportData.report_date)
                              : null)
                          }
                          onChange={(date) => {
                            field.onChange(date);
                          }}
                          // dateFormat="dd/MM/yyyy"
                          isClearable
                          maxDate={new Date()}
                          placeholderText="Select Date"
                          className="border h-11 pl-10 pr-3 py-2 rounded text-sm focus:outline-none w-full"
                        />
                      )}
                    /> */}
                    <FaRegCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                  {errors.report_date?.type === "required" && isSubmitted && (
                    <p role="alert" className="text-red-500">
                      ** Date is required
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-4 col-span-2 gap-3">
                  {/* WPDev Ticket reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many WPDeveloper Tickets have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={singleReportData.wpdev_ticket_reply}
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
                        value={singleReportData.storeware_ticket_reply}
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
                        defaultValue={singleReportData.xcloud_ticket_reply}
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
                        defaultValue={singleReportData.easyjobs_ticket_reply}
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
                </div>

                <div className="grid md:grid-cols-4 col-span-2 gap-3 items-end">
                  {/* Userback feedback reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Userback feedback have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={singleReportData.userback_reply}
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
                        defaultValue={singleReportData.wpdev_crisp_reply}
                        {...register("wpdev_crisp_reply", { required: true })}
                        aria-invalid={
                          errors.wpdev_crisp_reply ? "true" : "false"
                        }
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
                        defaultValue={
                          singleReportData.wpdev_crisp_magic_browser_reply
                        }
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
                        defaultValue={singleReportData.storeware_crisp_reply}
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
                </div>

                <div className="grid md:grid-cols-4 col-span-2 gap-3 items-end">
                  {/* Storeware Crisp magic browser reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Storeware Crisp Chats have you reached out to
                      today through Magic Browser?
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={
                          singleReportData.storeware_crisp_magic_browser_reply
                        }
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
                        defaultValue={singleReportData.xcloud_crisp_reply}
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
                        defaultValue={
                          singleReportData.xcloud_crisp_magic_browser_reply
                        }
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
                        defaultValue={singleReportData.wp_org_reply}
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
                </div>

                <div className="grid md:grid-cols-4 col-span-2 gap-3 items-end">
                  {/* FB post reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Facebook Posts have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={singleReportData.fb_post_reply}
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
                        defaultValue={singleReportData.github_reply}
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
                      How many cards on Trello/Fluent Boards/Jira/Clickup have
                      you created today?
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={singleReportData.client_issue_card}
                        {...register("client_issue_card", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.client_issue_card ? "true" : "false"
                        }
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
                      How many cards on Trello/Fluent Boards/Jira/Clickup have
                      you made follow up on today?
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={
                          singleReportData.client_issue_card_followup
                        }
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
                </div>

                <div className="grid md:grid-cols-4 col-span-2 gap-3 items-end">
                  {/* HS Tickets closed */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Tickets have you closed today?
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={singleReportData.hs_ticket_close}
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
                        defaultValue={singleReportData.hs_ticket_followup}
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
                        defaultValue={singleReportData.bulk_client_email}
                        {...register("bulk_client_email", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.bulk_client_email ? "true" : "false"
                        }
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
                      How many Review Request Did you send today for Shopify
                      Apps?
                    </label>
                    <div className="relative">
                      <input
                        defaultValue={singleReportData.shopify_app_review}
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
                </div>

                <div className="grid md:grid-cols-3 col-span-2 gap-3">
                  {/* Shopify Apps review received */}
                  <div className="grid grid-cols-2 gap-x-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        How many Reviews did you get today for Shopify Apps?
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          value={shopifyReview}
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
                          defaultValue={
                            singleReportData.shopify_app_review_links
                          }
                        ></textarea>
                        {errors.shopify_app_review_links?.type ===
                          "required" && (
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
                        How many Reviews did you get today for WordPress
                        plugins?
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          value={wpPluginReview}
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
                          defaultValue={singleReportData.wporg_review_links}
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
                          value={trustPilotReview}
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
                          defaultValue={
                            singleReportData.trustpilot_review_links
                          }
                        ></textarea>
                        {errors.trustpilot_review_links?.type ===
                          "required" && (
                          <p role="alert" className="text-red-500">
                            This field is required
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 col-span-2">
                  <div className="space-y-7">
                    {/* Customer rating on HS */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        How many customer ratings did you get on Helpscout
                        today?
                      </label>
                      <div className="relative">
                        <input
                          {...register("hs_ratings", {
                            required: true,
                          })}
                          defaultValue={singleReportData.hs_ratings}
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
                          defaultValue={singleReportData.crisp_ratings}
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
                  </div>

                  {/* Notes (others task info) */}
                  <div className="">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Notes (others task info)
                    </label>
                    <div className="relative">
                      <textarea
                        {...register("additional_notes")}
                        placeholder="Type your message here..."
                        rows="6"
                        className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                        defaultValue={singleReportData.additional_notes}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-end gap-6 px-2 mt-6 sm:flex-row sm:justify-end">
              <div className="flex items-center w-full gap-3 sm:w-auto">
                <button
                  type="button"
                  className="btn flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  Update Info
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditWorkupdate;
