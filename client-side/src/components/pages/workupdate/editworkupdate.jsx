import { TiArrowBack } from "react-icons/ti";
import { Link, useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useaxiossecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useauth";
import { showToast } from "../../utils/toasters/toastService";

const EditWorkupdate = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [date, setDate] = useState(null);
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm();

  const parseDate = (str) => {
    if (!str) return null;
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  const { data: singleReportData = [] } = useQuery({
    queryKey: ["singleReportData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reportById", {
        params: { id },
      });
      return res.data;
    },
  });

  const shopifyReview = watch("shopify_app_review_get");
  const wpPluginReview = watch("wporg_review_get");
  const trustPilotReview = watch("trustpilot_review_get");

  useEffect(() => {
    if (!singleReportData) return;
    const fieldMappings = {
      report_date: singleReportData.report_date
        ? parseDate(singleReportData.report_date)
        : undefined,

      wpdev_ticket_reply: singleReportData.wpdev_ticket_reply,
      storeware_ticket_reply: singleReportData.storeware_ticket_reply,
      xcloud_ticket_reply: singleReportData.xcloud_ticket_reply,
      easyjobs_ticket_reply: singleReportData.easyjobs_ticket_reply,
      userback_reply: singleReportData.userback_reply,
      wpdev_crisp_reply: singleReportData.wpdev_crisp_reply,
      wpdev_crisp_magic_browser_reply:
        singleReportData.wpdev_crisp_magic_browser_reply,
      storeware_crisp_reply: singleReportData.storeware_crisp_reply,
      storeware_crisp_magic_browser_reply:
        singleReportData.storeware_crisp_magic_browser_reply,
      xcloud_crisp_reply: singleReportData.xcloud_crisp_reply,
      xcloud_crisp_magic_browser_reply:
        singleReportData.xcloud_crisp_magic_browser_reply,
      wp_org_reply: singleReportData.wp_org_reply,
      fb_post_reply: singleReportData.fb_post_reply,
      github_reply: singleReportData.github_reply,
      client_issue_card_create: singleReportData.client_issue_card_create,
      client_issue_card_followup: singleReportData.client_issue_card_followup,
      hs_ticket_close: singleReportData.hs_ticket_close,
      hs_ticket_followup: singleReportData.hs_ticket_followup,
      bulk_client_email_sent: singleReportData.bulk_client_email_sent,

      shopify_app_review_req_send: singleReportData.shopify_app_review_req_send,
      shopify_app_review_get:
        singleReportData.shopify_app_review_get?.toString(),
      shopify_app_review_links: singleReportData.shopify_app_review_links,

      wporg_review_get: singleReportData.wporg_review_get?.toString(),
      wporg_review_links: singleReportData.wporg_review_links,

      trustpilot_review_get: singleReportData.trustpilot_review_get?.toString(),
      trustpilot_review_links: singleReportData.trustpilot_review_links,

      hs_ratings: singleReportData.hs_ratings,
      crisp_ratings: singleReportData.crisp_ratings,

      additional_notes: singleReportData.additional_notes,
    };

    Object.entries(fieldMappings).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key, value);
      }
    });
  }, [singleReportData, setValue]);

  const onSubmit = async (updateData) => {
    const formattedDate = format(updateData.report_date, "dd-MM-yyyy");
    if (Number(updateData.shopify_app_review_get) === 0) {
      updateData.shopify_app_review_links = "";
    }
    if (Number(updateData.wporg_review_get) === 0) {
      updateData.wporg_review_links = "";
    }
    if (Number(updateData.trustpilot_review_get) === 0) {
      updateData.trustpilot_review_links = "";
    }

    const newUpdateData = {
      ...updateData,
      report_date: formattedDate,
      email: user.email,
    };

    const updateRes = await axiosSecure.patch(
      `/updateworkreport/${id}`,
      newUpdateData
    );

    if (updateRes.data.modifiedCount > 0 && updateRes.data.matchedCount > 0) {
      showToast("success", "Work Report updated successfully");
      reset();
      navigate("/workUpdate");
    } else if (updateRes.data.matchedCount > 0) {
      showToast("info", "No changes on your report");
      reset();
      navigate("/workUpdate");
    }
    console.log(updateRes.data);
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
            <div className="custom-scrollbar h-[72vh] overflow-y-auto px-2 py-4">
              {/* <div className="flex flex-col gap-y-5"> */}
              <div className="grid grid-cols-2 gap-8">
                {/* Date Picker */}
                <div className="w-2/3 flex items-center gap-x-4 col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Select Date
                  </label>
                  <div className="relative">
                    <Controller
                      control={control}
                      name="report_date"
                      defaultValue={date}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="dd-MM-yyyy"
                          maxDate={new Date()}
                          isClearable
                          className="border h-11 pl-10 pr-3 py-2 rounded text-sm focus:outline-none w-7/8"
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

                <div className="grid md:grid-cols-4 col-span-2 gap-3 items-end">
                  {/* WPDev Ticket reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many WPDeveloper Tickets have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="wpdev_ticket_reply"
                        {...register("wpdev_ticket_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.wpdev_ticket_reply ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
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
                        type="number"
                        placeholder="storeware_ticket_reply"
                        {...register("storeware_ticket_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.storeware_ticket_reply ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.storeware_ticket_reply?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* xCloud Ticket reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many xCloud Tickets have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="xcloud_ticket_reply"
                        {...register("xcloud_ticket_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.xcloud_ticket_reply ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.xcloud_ticket_reply?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* EasyJobs Ticket reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many easy.jobs Tickets have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="easyjobs_ticket_reply"
                        {...register("easyjobs_ticket_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.easyjobs_ticket_reply ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
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
                  {/* Userback Ticket reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Userback feedback have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="userback_reply"
                        {...register("userback_reply", { required: true })}
                        aria-invalid={errors.userback_reply ? "true" : "false"}
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.userback_reply?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* WPDev CRISP reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many WPDeveloper Crisp Chats have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="wpdev_crisp_reply"
                        {...register("wpdev_crisp_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.wpdev_crisp_reply ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.wpdev_crisp_reply?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* WPDev Magic browser reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many WPDeveloper Crisp Chats have you reached out to
                      today through Magic Browser?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="wpdev_crisp_magic_browser_reply"
                        {...register("wpdev_crisp_magic_browser_reply", {
                          require: true,
                        })}
                        aria-invalid={
                          errors.wpdev_crisp_magic_browser_reply
                            ? "true"
                            : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.wpdev_crisp_magic_browser_reply?.type ===
                      "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Storeware CRISP reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Storeware Crisp Chats have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="storeware_crisp_reply"
                        {...register("storeware_crisp_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.storeware_crisp_reply ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
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
                  {/* Storeware Magic Browser reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Storeware Crisp Chats have you reached out to
                      today through Magic Browser?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="storeware_crisp_magic_browser_reply"
                        {...register("storeware_crisp_magic_browser_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.storeware_crisp_magic_browser_reply
                            ? "true"
                            : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.storeware_crisp_magic_browser_reply?.type ===
                      "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* xCloud CRISP reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many xCloud Crisp Chats have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="xcloud_crisp_reply"
                        {...register("xcloud_crisp_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.xcloud_crisp_reply ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.xcloud_crisp_reply?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* xCloud Magic browser reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many xCloud Crisp Chats have you reached out to today
                      through Magic Browser?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="xcloud_crisp_magic_browser_reply"
                        {...register("xcloud_crisp_magic_browser_reply", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.xcloud_crisp_magic_browser_reply
                            ? "true"
                            : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.xcloud_crisp_magic_browser_reply?.type ===
                      "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* WordPress ORG reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many WordPress.ORG threads have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="wp_org_reply"
                        {...register("wp_org_reply", { required: true })}
                        aria-invalid={errors.wp_org_reply ? "true" : "false"}
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
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
                  {/* Facebook post reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Facebook Posts have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="fb_post_reply"
                        {...register("fb_post_reply", { required: true })}
                        aria-invalid={errors.fb_post_reply ? "true" : "false"}
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.fb_post_reply?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Github Issue reply */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many GitHub Issues have you replied today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="github_reply"
                        {...register("github_reply", { required: true })}
                        aria-invalid={errors.github_reply ? "true" : "false"}
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.github_reply?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Client issue related card create */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many cards on Trello/Fluent Boards/Jira/Clickup have
                      you created today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="client_issue_card_create"
                        {...register("client_issue_card_create", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.client_issue_card_create ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.client_issue_card_create?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Client issue related card followup */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many cards on Trello/Fluent Boards/Jira/Clickup have
                      you made follow up on today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="client_issue_card_followup"
                        {...register("client_issue_card_followup", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.client_issue_card_followup ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
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
                  {/* HS ticket close */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Tickets have you closed today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="hs_ticket_close"
                        {...register("hs_ticket_close", { required: true })}
                        aria-invalid={errors.hs_ticket_close ? "true" : "false"}
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.hs_ticket_close?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* HS Ticket followup */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many tickets have you followed up today?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="hs_ticket_followup"
                        {...register("hs_ticket_followup", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.hs_ticket_followup ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.hs_ticket_followup?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Bulk client email send */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Bulk Client Checkup Emails
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="bulk_client_email_sent"
                        {...register("bulk_client_email_sent", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.bulk_client_email_sent ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.bulk_client_email_sent?.type === "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* Shopify App Review request send */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      How many Review Request Did you send today for Shopify
                      Apps?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="shopify_app_review_req_send"
                        {...register("shopify_app_review_req_send", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.shopify_app_review_req_send ? "true" : "false"
                        }
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    {errors.shopify_app_review_req_send?.type ===
                      "required" && (
                      <p role="alert" className="text-red-500">
                        This field is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 col-span-2 gap-3">
                  {/* Shopify Apps review request and received */}
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
                          className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        >
                          {[...Array(11).keys()].map((val) => (
                            <option
                              key={val}
                              value={val}
                              className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                            >
                              {val}
                            </option>
                          ))}
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

                    <div>
                      <textarea
                        {...register("shopify_app_review_links", {
                          required: shopifyReview !== "0",
                        })}
                        aria-invalid={
                          errors.shopify_app_review_links ? "true" : "false"
                        }
                        placeholder="Review Links for Shopify Apps. Use Comma for adding multiple links..."
                        rows="6"
                        disabled={shopifyReview === "0"}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      />
                      {errors.shopify_app_review_links?.type === "required" && (
                        <p role="alert" className="text-red-500">
                          This field is required
                        </p>
                      )}
                    </div>
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
                          {...register("wporg_review_get", {
                            required: true,
                          })}
                          aria-invalid={
                            errors.wporg_review_get ? "true" : "false"
                          }
                          className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        >
                          {[...Array(11).keys()].map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
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

                    <div>
                      <textarea
                        {...register("wporg_review_links", {
                          required: wpPluginReview !== "0",
                        })}
                        aria-invalid={
                          errors.wporg_review_links ? "true" : "false"
                        }
                        placeholder="Review Links for WordPress plugins. Use Comma for adding multiple links..."
                        rows="6"
                        disabled={wpPluginReview === "0"}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      />
                      {errors.wporg_review_links?.type === "required" && (
                        <p role="alert" className="text-red-500">
                          This field is required
                        </p>
                      )}
                    </div>
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
                          className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        >
                          {[...Array(11).keys()].map((val) => (
                            <option
                              key={val}
                              value={val}
                              className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                            >
                              {val}
                            </option>
                          ))}
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

                    <div>
                      <textarea
                        {...register("trustpilot_review_links", {
                          required: trustPilotReview !== "0",
                        })}
                        aria-invalid={
                          errors.trustpilot_review_links ? "true" : "false"
                        }
                        placeholder="TrustPilot review link/links. Use Comma for adding multiple links..."
                        rows="6"
                        disabled={trustPilotReview === "0"}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      />
                      {errors.trustpilot_review_links?.type === "required" && (
                        <p role="alert" className="text-red-500">
                          This field is required
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 col-span-2 items-center">
                  <div className="space-y-6">
                    {/* Customer rating on HS */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        How many customer ratings did you get on Helpscout
                        today?
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="hs_ratings"
                          {...register("hs_ratings", { required: true })}
                          aria-invalid={errors.hs_ratings ? "true" : "false"}
                          className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
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
                          type="number"
                          placeholder="crisp_ratings"
                          {...register("crisp_ratings", { required: true })}
                          aria-invalid={errors.crisp_ratings ? "true" : "false"}
                          className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
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
                        rows="7"
                        className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden   bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-end gap-6 px-2 mt-6 sm:flex-row sm:justify-end">
              <div className="flex items-center w-full gap-3 sm:w-auto">
                <Link to="/workUpdate">
                  <button
                    type="button"
                    className="btn flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                  >
                    Cancel
                  </button>
                </Link>

                <button
                  type="submit"
                  className="btn flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  Update Work Update
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
