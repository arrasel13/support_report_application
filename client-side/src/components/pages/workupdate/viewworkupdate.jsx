import { useQuery } from "@tanstack/react-query";
import { TiArrowBack } from "react-icons/ti";
import { Link, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useaxiossecure";
import { FaRegEdit } from "react-icons/fa";
// import useAuth from "../../../hooks/useauth";

const ViewWorkUpdate = () => {
  const { id } = useParams();
  // const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: singleReport = [] } = useQuery({
    queryKey: ["singleReport"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reportById", {
        params: { id },
      });
      return res.data;
    },
  });

  // console.log("Single Report Data: ", singleReport);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Link to="/workUpdate">
              <TiArrowBack className="w-5 h-5 cursor-pointer" />
            </Link>
            <span>View Work Update: {singleReport.report_date}</span>
          </div>
          <div>
            <Link to={`/workUpdate/${id}/edit`}>
              <button className="btn bg-yellow-400 border-none hover:bg-yellow-500 flex justify-center items-center gap-1">
                <FaRegEdit />
                Edit
              </button>
            </Link>
          </div>
        </div>

        {/* Added data */}
        <div className="grid grid-cols-2">
          <div className="flex gap-2 border p-2">
            <p className="font-semibold">WPDev Tickets Replied:</p>
            <span className="">{singleReport.wpdev_ticket_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Storeware Tickets Replied:</p>
            <span className="">{singleReport.storeware_ticket_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">xCloud Tickets Replied:</p>
            <span className="">{singleReport.xcloud_ticket_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">easy.jobs Tickets Replied:</p>
            <span className="">{singleReport.easyjobs_ticket_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Userback Replied:</p>
            <span className="">{singleReport.userback_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">WPDev CRISP Replied:</p>
            <span className="">{singleReport.wpdev_crisp_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">
              WPDev CRISP (Magic Browser) Replied:
            </p>
            <span className="">
              {singleReport.wpdev_crisp_magic_browser_reply}
            </span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Storeware CRISP Replied:</p>
            <span className="">{singleReport.storeware_crisp_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">
              Storeware CRISP (Magic Browser) Replied:
            </p>
            <span className="">
              {singleReport.storeware_crisp_magic_browser_reply}
            </span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">xCloud CRISP Replied:</p>
            <span className="">{singleReport.xcloud_crisp_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">
              xCloud CRISP (Magic Browser) Replied:
            </p>
            <span className="">
              {singleReport.xcloud_crisp_magic_browser_reply}
            </span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">WP Org Replied:</p>
            <span className="">{singleReport.wp_org_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Facebook Replied:</p>
            <span className="">{singleReport.fb_post_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Github Replied:</p>
            <span className="">{singleReport.github_reply}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Card Created:</p>
            <span className="">{singleReport.client_issue_card_create}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Card created Followup:</p>
            <span className="">{singleReport.client_issue_card_followup}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">HS Ticket Closed:</p>
            <span className="">{singleReport.hs_ticket_close}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">HS Ticket Followup:</p>
            <span className="">{singleReport.hs_ticket_followup}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Client Checkup Email:</p>
            <span className="">{singleReport.bulk_client_email_sent}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Shopify Review Request:</p>
            <span className="">{singleReport.shopify_app_review_req_send}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Shopify Review Get:</p>
            <span className="">{singleReport.shopify_app_review_get}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">Shopify Review Links:</p>
            <span className="">{singleReport.shopify_app_review_links}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">WP Plugin Review Get:</p>
            <span className="">{singleReport.wporg_review_get}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">WP Plugin Review Links:</p>
            <span className="">{singleReport.wporg_review_links}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">TrustPilot Review Get:</p>
            <span className="">{singleReport.trustpilot_review_get}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">TrustPilot Review Links:</p>
            <span className="">{singleReport.trustpilot_review_links}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">HS Rating Get:</p>
            <span className="">{singleReport.hs_ratings}</span>
          </div>

          <div className="flex gap-2 border p-2">
            <p className="font-semibold">CRISP Rating Get:</p>
            <span className="">{singleReport.crisp_ratings}</span>
          </div>

          <div className="border p-2  col-span-2">
            <p className="font-semibold">Notes (others task info):</p>
            <span className="">{singleReport.additional_notes}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewWorkUpdate;
