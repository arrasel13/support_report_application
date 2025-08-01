import React, { useEffect, useState } from "react";
import BreadCrumb from "../common/breadcrumb";
import { GrWorkshop } from "react-icons/gr";
import AddWorkUpdate from "../../utils/modals/addWorkUpdate";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useaxiossecure";
import useAuth from "../../../hooks/useauth";
import { Link } from "react-router";
import { FaRegEye } from "react-icons/fa6";
import useAdmin from "../../../hooks/useadmin";
import { showToast } from "../../utils/toasters/toastService";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // required

const WorkUpdate = () => {
  const [isAdmin] = useAdmin();
  // console.log("Admin or super admin", isAdmin);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    document.title = "Work Update";
  }, []);

  const { data: reports = [], refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await axiosSecure.get("reports", {
        params: { email: user.email },
      });
      return res.data;
    },
  });

  // console.log("Reports: ", reports);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const filteredData = reports?.filter(
    (item) =>
      item.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
      item.email?.toLowerCase().includes(globalFilter.toLowerCase())
  );

  const paginatedData = filteredData?.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const totalPages = Math.ceil(filteredData?.length / pageSize);

  const handleWorkUpdateDelete = (id) => {
    // console.log("Deleted ID: ", id);
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this report?",
      buttons: [
        {
          label: "Yes",
          onClick: () => performDelete(id),
        },
        {
          label: "No",
        },
      ],
    });

    const performDelete = async (id) => {
      const deleteRes = await axiosSecure.delete("/deleteReportById", {
        params: { id },
      });
      if (deleteRes.data.deletedCount > 0) {
        showToast("success", "Report deleted successfully!");
        refetch();
      } else {
        showToast("error", "Failed to delete the report.");
      }
    };
  };

  return (
    <>
      <BreadCrumb bTitle="Daily Work Update" bText="Work Update" />

      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-col gap-4 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* <button
                className="btn btn-soft btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-3 text-theme-sm font-medium shadow-theme-xs hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                onClick={() =>
                  document.getElementById("add_work_update").showModal()
                }
              > */}
              <Link to="add">
                <button className="btn btn-soft btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-3 text-theme-sm font-medium shadow-theme-xs hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                  <GrWorkshop className="text-lg" />
                  Work Update
                </button>
              </Link>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* <form> */}
              <div className="relative">
                <button className="absolute -translate-y-1/2 left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
                      fill=""
                    ></path>
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  className="dark:bg-dark-900 h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                  value={globalFilter}
                  onChange={(e) => {
                    setGlobalFilter(e.target.value);
                    setPageIndex(0); // reset to first page on search
                  }}
                />
              </div>
              {/* </form> */}
            </div>
          </div>

          <div>
            {/* Header actions */}

            {/* Table */}
            <div className="relative max-w-[1340px] mx-auto overflow-x-auto">
              <table className="min-w-max w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {/* S.N - sticky left */}
                    {/* {["admin", "superadmin"].includes(reports.role) && ( */}
                    {isAdmin && (
                      <th className="sticky left-0 bg-gray-50 dark:bg-gray-700 px-6 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 text-start">
                        Name
                      </th>
                    )}

                    <th
                      className={`sticky ${
                        // ["admin", "superadmin"].includes(reports.role)
                        isAdmin ? "left-20" : "left-0"
                      } bg-gray-50 dark:bg-gray-700 px-6 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 text-start`}
                    >
                      Date
                    </th>

                    {/* Normal scrollable columns */}
                    <th className="px-6 py-3">WPDev Tickets Replied</th>
                    <th className="px-6 py-3">Storeware Tickets Replied</th>
                    <th className="px-6 py-3">xCloud Tickets Replied</th>
                    <th className="px-6 py-3">easy.jobs Tickets Replied</th>
                    <th className="px-6 py-3">Userback Replied</th>
                    <th className="px-6 py-3">WPDev CRISP Replied</th>
                    <th className="px-6 py-3">
                      WPDev CRISP (Magic Browser) Replied
                    </th>
                    <th className="px-6 py-3">Storeware CRISP Replied</th>
                    <th className="px-6 py-3">
                      Storeware CRISP (Magic Browser) Replied
                    </th>
                    <th className="px-6 py-3">xCloud CRISP Replied</th>
                    <th className="px-6 py-3">
                      xCloud CRISP (Magic Browser) Replied
                    </th>
                    <th className="px-6 py-3">WP Org Replied</th>
                    <th className="px-6 py-3">Facebook Replied</th>
                    <th className="px-6 py-3">Github Replied</th>
                    <th className="px-6 py-3">Card Created</th>
                    <th className="px-6 py-3">Card created Followup</th>
                    <th className="px-6 py-3">HS Ticket Closed</th>
                    <th className="px-6 py-3">HS Ticket Followup</th>
                    <th className="px-6 py-3">Client Checkup Email</th>
                    <th className="px-6 py-3">Shopify Review Request</th>
                    <th className="px-6 py-3">Shopify Review Get</th>
                    <th className="px-6 py-3">Shopify Review Links</th>
                    <th className="px-6 py-3">WP Plugin Review Get</th>
                    <th className="px-6 py-3">WP Plugin Review Links</th>
                    <th className="px-6 py-3">TrustPilot Review Get</th>
                    <th className="px-6 py-3">TrustPilot Review Links</th>
                    <th className="px-6 py-3">HS Rating Get</th>
                    <th className="px-6 py-3">CRISP Rating Get</th>
                    <th className="px-6 py-3">Notes (others task info)</th>

                    {/* Action - sticky right */}
                    <th className="sticky right-0 bg-gray-50 dark:bg-gray-700 px-6 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 text-start">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {paginatedData?.length > 0 ? (
                    paginatedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {/* {["admin", "superadmin"].includes(reports.role) && ( */}
                        {isAdmin && (
                          <td className="sticky left-0 bg-white dark:bg-gray-900 px-4 sm:px-6 py-3.5">
                            {row.name}
                          </td>
                        )}
                        <td
                          className={`sticky ${
                            // ["admin", "superadmin"].includes(reports.role)
                            isAdmin ? "left-20" : "left-0"
                          } bg-white dark:bg-gray-900 px-4 sm:px-6 py-3.5`}
                        >
                          {row.report_date}
                        </td>

                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.wpdev_ticket_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.storeware_ticket_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.xcloud_ticket_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.easyjobs_ticket_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.userback_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.wpdev_crisp_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.wpdev_crisp_magic_browser_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.storeware_crisp_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.storeware_crisp_magic_browser_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.xcloud_crisp_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.xcloud_crisp_magic_browser_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.wp_org_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.fb_post_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.github_reply}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.client_issue_card_create}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.client_issue_card_followup}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.hs_ticket_close}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.hs_ticket_followup}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.bulk_client_email_sent}
                        </td>

                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.shopify_app_review_req_send}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.shopify_app_review_get}
                        </td>
                        <td className="w-[220px] px-4 sm:px-6 py-3.5">
                          {row.shopify_app_review_links ? (
                            row.shopify_app_review_links
                              .split(",")
                              .map((review, index) => (
                                <a
                                  key={index}
                                  href={review.trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-blue-600 underline"
                                >
                                  {review.trim()}
                                </a>
                              ))
                          ) : (
                            <span className="text-gray-400">
                              No Review links
                            </span>
                          )}
                        </td>

                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.wporg_review_get}
                        </td>
                        <td className="w-[220px] px-4 sm:px-6 py-3.5">
                          {row.wporg_review_links ? (
                            row.wporg_review_links
                              .split(",")
                              .map((review, index) => (
                                <Link
                                  key={index}
                                  to={review.trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-blue-600 underline"
                                >
                                  {review.trim()}
                                </Link>
                              ))
                          ) : (
                            <span className="text-gray-400">
                              No Review links
                            </span>
                          )}
                        </td>

                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.trustpilot_review_get}
                        </td>
                        <td className="w-[220px] px-4 sm:px-6 py-3.5">
                          {row.trustpilot_review_links ? (
                            row.trustpilot_review_links
                              .split(",")
                              .map((review, index) => (
                                <Link
                                  key={index}
                                  to={review.trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-blue-600 underline"
                                >
                                  {review.trim()}
                                </Link>
                              ))
                          ) : (
                            <span className="text-gray-400">
                              No Review links
                            </span>
                          )}
                        </td>

                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.hs_ratings}
                        </td>
                        <td className=" px-4 sm:px-6 py-3.5">
                          {row.crisp_ratings}
                        </td>
                        <td className="w-[350px] px-4 sm:px-6 py-3.5">
                          {row.additional_notes}
                        </td>
                        <td className="sticky right-0 bg-white dark:bg-gray-900 px-4 sm:px-6 py-3.5">
                          <div className="flex items-center w-full gap-2">
                            {/* View */}
                            <Link to={`/workUpdate/${row._id}`}>
                              <button className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 cursor-pointer flex items-center">
                                <FaRegEye className="text-xl" />
                                {/* <svg
                                width="1em"
                                height="1em"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M6.54142 3.7915C6.54142 2.54886 7.54878 1.5415 8.79142 1.5415H11.2081C12.4507 1.5415 13.4581 2.54886 13.4581 3.7915V4.0415H15.6252H16.666C17.0802 4.0415 17.416 4.37729 17.416 4.7915C17.416 5.20572 17.0802 5.5415 16.666 5.5415H16.3752V8.24638V13.2464V16.2082C16.3752 17.4508 15.3678 18.4582 14.1252 18.4582H5.87516C4.63252 18.4582 3.62516 17.4508 3.62516 16.2082V13.2464V8.24638V5.5415H3.3335C2.91928 5.5415 2.5835 5.20572 2.5835 4.7915C2.5835 4.37729 2.91928 4.0415 3.3335 4.0415H4.37516H6.54142V3.7915ZM14.8752 13.2464V8.24638V5.5415H13.4581H12.7081H7.29142H6.54142H5.12516V8.24638V13.2464V16.2082C5.12516 16.6224 5.46095 16.9582 5.87516 16.9582H14.1252C14.5394 16.9582 14.8752 16.6224 14.8752 16.2082V13.2464ZM8.04142 4.0415H11.9581V3.7915C11.9581 3.37729 11.6223 3.0415 11.2081 3.0415H8.79142C8.37721 3.0415 8.04142 3.37729 8.04142 3.7915V4.0415ZM8.3335 7.99984C8.74771 7.99984 9.0835 8.33562 9.0835 8.74984V13.7498C9.0835 14.1641 8.74771 14.4998 8.3335 14.4998C7.91928 14.4998 7.5835 14.1641 7.5835 13.7498V8.74984C7.5835 8.33562 7.91928 7.99984 8.3335 7.99984ZM12.4168 8.74984C12.4168 8.33562 12.081 7.99984 11.6668 7.99984C11.2526 7.99984 10.9168 8.33562 10.9168 8.74984V13.7498C10.9168 14.1641 11.2526 14.4998 11.6668 14.4998C12.081 14.4998 12.4168 14.1641 12.4168 13.7498V8.74984Z"
                                  fill="currentColor"
                                ></path>
                              </svg> */}
                              </button>
                            </Link>

                            {/* Edit */}
                            <Link to={`/workUpdate/${row._id}/edit`}>
                              <button className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 cursor-pointer flex items-center">
                                <svg
                                  width="1em"
                                  height="1em"
                                  viewBox="0 0 21 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M17.0911 3.53206C16.2124 2.65338 14.7878 2.65338 13.9091 3.53206L5.6074 11.8337C5.29899 12.1421 5.08687 12.5335 4.99684 12.9603L4.26177 16.445C4.20943 16.6931 4.286 16.9508 4.46529 17.1301C4.64458 17.3094 4.90232 17.3859 5.15042 17.3336L8.63507 16.5985C9.06184 16.5085 9.45324 16.2964 9.76165 15.988L18.0633 7.68631C18.942 6.80763 18.942 5.38301 18.0633 4.50433L17.0911 3.53206ZM14.9697 4.59272C15.2626 4.29982 15.7375 4.29982 16.0304 4.59272L17.0027 5.56499C17.2956 5.85788 17.2956 6.33276 17.0027 6.62565L16.1043 7.52402L14.0714 5.49109L14.9697 4.59272ZM13.0107 6.55175L6.66806 12.8944C6.56526 12.9972 6.49455 13.1277 6.46454 13.2699L5.96704 15.6283L8.32547 15.1308C8.46772 15.1008 8.59819 15.0301 8.70099 14.9273L15.0436 8.58468L13.0107 6.55175Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </button>
                            </Link>

                            {/* Delete */}
                            {isAdmin && (
                              <button
                                onClick={() => handleWorkUpdateDelete(row._id)}
                                className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 cursor-pointer flex items-center"
                              >
                                <svg
                                  width="1em"
                                  height="1em"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.54142 3.7915C6.54142 2.54886 7.54878 1.5415 8.79142 1.5415H11.2081C12.4507 1.5415 13.4581 2.54886 13.4581 3.7915V4.0415H15.6252H16.666C17.0802 4.0415 17.416 4.37729 17.416 4.7915C17.416 5.20572 17.0802 5.5415 16.666 5.5415H16.3752V8.24638V13.2464V16.2082C16.3752 17.4508 15.3678 18.4582 14.1252 18.4582H5.87516C4.63252 18.4582 3.62516 17.4508 3.62516 16.2082V13.2464V8.24638V5.5415H3.3335C2.91928 5.5415 2.5835 5.20572 2.5835 4.7915C2.5835 4.37729 2.91928 4.0415 3.3335 4.0415H4.37516H6.54142V3.7915ZM14.8752 13.2464V8.24638V5.5415H13.4581H12.7081H7.29142H6.54142H5.12516V8.24638V13.2464V16.2082C5.12516 16.6224 5.46095 16.9582 5.87516 16.9582H14.1252C14.5394 16.9582 14.8752 16.6224 14.8752 16.2082V13.2464ZM8.04142 4.0415H11.9581V3.7915C11.9581 3.37729 11.6223 3.0415 11.2081 3.0415H8.79142C8.37721 3.0415 8.04142 3.37729 8.04142 3.7915V4.0415ZM8.3335 7.99984C8.74771 7.99984 9.0835 8.33562 9.0835 8.74984V13.7498C9.0835 14.1641 8.74771 14.4998 8.3335 14.4998C7.91928 14.4998 7.5835 14.1641 7.5835 13.7498V8.74984C7.5835 8.33562 7.91928 7.99984 8.3335 7.99984ZM12.4168 8.74984C12.4168 8.33562 12.081 7.99984 11.6668 7.99984C11.2526 7.99984 10.9168 8.33562 10.9168 8.74984V13.7498C10.9168 14.1641 11.2526 14.4998 11.6668 14.4998C12.081 14.4998 12.4168 14.1641 12.4168 13.7498V8.74984Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="32" className="px-4 sm:px-6 py-3.5">
                        No Work Update Data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-4 px-6 py-4 border-t border-gray-100 mt-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Page Size */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageIndex(0); // reset to first page on size change
                  }}
                  className="btn font-normal border rounded text-sm select cursor-pointer focus:outline-none focus:ring-0 focus:border-gray-300"
                >
                  {[5, 10, 20].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pagination */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={pageIndex === 0}
                  className="join-item btn px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={pageIndex >= totalPages - 1}
                  className="join-item btn px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <dialog
        id="add_work_update"
        className="modal fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999"
      >
        <AddWorkUpdate refetch={refetch} />
      </dialog>
    </>
  );
};

export default WorkUpdate;
