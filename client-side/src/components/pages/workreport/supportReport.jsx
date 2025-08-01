import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactApexChart from "react-apexcharts";
import { TiArrowBack } from "react-icons/ti";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useaxiossecure";

// const reportData = [
//   {
//     month: "January",
//     shopifyRequest: 16,
//     shopifyReceived: 4,
//     orgReviews: 3,
//     wpTickets: 237,
//     storewareTickets: 0,
//     xcloudTickets: 4,
//     wpCrisp: 358,
//     storewareCrisp: 91,
//     magicBrowser: 27,
//     xcloudCrisp: 8,
//     wpOrg: 2,
//     facebook: 0,
//     closed: 34,
//   },
//   {
//     month: "February",
//     shopifyRequest: 33,
//     shopifyReceived: 11,
//     orgReviews: 17,
//     wpTickets: 191,
//     storewareTickets: 0,
//     xcloudTickets: 1,
//     wpCrisp: 388,
//     storewareCrisp: 127,
//     magicBrowser: 18,
//     xcloudCrisp: 15,
//     wpOrg: 14,
//     facebook: 0,
//     closed: 16,
//   },
//   {
//     month: "March",
//     shopifyRequest: 3,
//     shopifyReceived: 2,
//     orgReviews: 9,
//     wpTickets: 161,
//     storewareTickets: 0,
//     xcloudTickets: 1,
//     wpCrisp: 326,
//     storewareCrisp: 92,
//     magicBrowser: 0,
//     xcloudCrisp: 8,
//     wpOrg: 10,
//     facebook: 3,
//     closed: null,
//   },
// ];

const SupportReport = () => {
  const { email } = useParams();
  console.log("Email for support report: ", email);
  const axiosSecure = useAxiosSecure();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const { data: reportData = [] } = useQuery({
    queryKey: ["reportData"],
    queryFn: async () => {
      const res = await axiosSecure.get("workreports", {
        params: { email: email },
      });
      return res.data;
    },
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // console.log("Report data from DB", reportData);

  const chartOptions = {
    chart: {
      type: "area",
      height: "100%",
      toolbar: { show: false },
    },
    dataLabels: { enabled: true },
    stroke: { curve: "straight" },
    xaxis: {
      // categories: reportData.map((item) => item.month),
      // categories: reportData.map((item) => item._id.month),
      categories: reportData.map((item) => monthNames[item._id.month - 1]),
      labels: { show: true },
      axisBorder: { show: true },
      axisTicks: { show: true },
    },
    yaxis: { show: true },
    grid: { show: false },
    tooltip: { enabled: true },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
  };

  // Empty chart placeholder (preserves height)
  const loadingSeries = [
    {
      name: "Loading chart data...",
      data: [0], // Single point to keep chart active
    },
  ];

  const chartSeriesInfos = [
    {
      name: "Shopify Review Request",
      data: reportData.map((item) => item.shopify_review_request || 0),
    },
    {
      name: "Shopify Review Received",
      data: reportData.map((item) => item.shopify_review_received || 0),
    },
    {
      name: ".ORG Reviews",
      data: reportData.map((item) => item.org_reviews || 0),
    },
    {
      name: "WPDeveloper Tickets",
      data: reportData.map((item) => item.wpdev_tickets || 0),
    },
    {
      name: "Storeware Tickets",
      data: reportData.map((item) => item.storeware_tickets || 0),
    },
    {
      name: "xCloud Tickets",
      data: reportData.map((item) => item.xcloud_tickets || 0),
    },
    {
      name: "WPDeveloper Crisp",
      data: reportData.map((item) => item.wpdev_crisp || 0),
    },
    {
      name: "Storeware Crisp",
      data: reportData.map((item) => item.storeware_crisp || 0),
    },
    {
      name: "Magic Browser Crisp",
      data: reportData.map((item) => item.magic_browser_crisp || 0),
    },
    {
      name: "xCloud Crisp",
      data: reportData.map((item) => item.xcloud_crisp || 0),
    },
    {
      name: "WordPress.ORG",
      data: reportData.map((item) => item.wporg_reply || 0),
    },
    {
      name: "Facebook",
      data: reportData.map((item) => item.facebook || 0),
    },
    {
      name: "Tickets Closed",
      data: reportData.map((item) => item.tickets_closed || 0),
    },
  ];

  const reviewsSeriesInfos = chartSeriesInfos.slice(0, 3);
  const ticketsChatsSeriesInfos = chartSeriesInfos.slice(3, 9);

  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    setLoadingMain(true);
    setLoadingReviews(true);
    setLoadingTickets(true);

    // First: Load Reviews
    setTimeout(() => {
      setLoadingReviews(false);
    }, 2000);

    // Second: Load Chats & Tickets
    setTimeout(() => {
      setLoadingTickets(false);
    }, 2500);

    // Third: Load All Matrix
    setTimeout(() => {
      setLoadingMain(false);
    }, 3000);
  }, []);

  return (
    <div>
      {/* <h2>Support Report</h2> */}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Link to="/users">
              <TiArrowBack className="w-5 h-5 cursor-pointer" />
            </Link>
            <span>Report by User: {reportData.name}</span>
          </div>
          <div>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="Select date range"
              className="border px-3 py-2 rounded text-sm focus:outline-none w-60 text-center placeholder:text-center"
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()} // ⛔ disables future dates
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Month</th>
                <th className="p-2 border">Shopify Review Request</th>
                <th className="p-2 border">Shopify Review Received</th>
                <th className="p-2 border">.ORG Reviews</th>
                <th className="p-2 border">WPDeveloper Tickets</th>
                <th className="p-2 border">Storeware Tickets</th>
                <th className="p-2 border">xCloud Tickets</th>
                <th className="p-2 border">WPDeveloper Crisp</th>
                <th className="p-2 border">Storeware Crisp</th>
                <th className="p-2 border">Magic Browser Crisp</th>
                <th className="p-2 border">xCloud Crisp</th>
                <th className="p-2 border">WordPress.ORG</th>
                <th className="p-2 border">Facebook</th>
                <th className="p-2 border">Tickets Closed</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="p-2 border">
                    {monthNames[row._id.month - 1]}
                  </td>
                  <td className="p-2 border">{row.shopify_review_request}</td>
                  <td className="p-2 border">{row.shopify_review_received}</td>
                  <td className="p-2 border">{row.org_reviews}</td>
                  <td className="p-2 border">{row.wpdev_tickets}</td>
                  <td className="p-2 border">{row.storeware_tickets}</td>
                  <td className="p-2 border">{row.xcloud_tickets}</td>
                  <td className="p-2 border">{row.wpdev_crisp}</td>
                  <td className="p-2 border">{row.storeware_crisp}</td>
                  <td className="p-2 border">{row.magic_browser_crisp}</td>
                  <td className="p-2 border">{row.xcloud_crisp}</td>
                  <td className="p-2 border">{row.wporg_reply}</td>
                  <td className="p-2 border">{row.facebook}</td>
                  <td className="p-2 border">{row.tickets_closed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reviews and Chat/Tickets Charts */}
        <div className="grid grid-cols-2 gap-6 my-24">
          <div className="w-full h-64">
            <ReactApexChart
              options={{
                ...chartOptions,
                title: { text: "Reviews" },
              }}
              series={loadingReviews ? loadingSeries : reviewsSeriesInfos}
              type="area"
              height="100%"
            />
          </div>

          <div className="w-full h-64">
            <ReactApexChart
              options={{
                ...chartOptions,
                title: { text: "Chats & Tickets" },
              }}
              series={loadingTickets ? loadingSeries : ticketsChatsSeriesInfos}
              type="area"
              height="100%"
            />
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-64 mb-12">
          <ReactApexChart
            options={{
              ...chartOptions,
              title: { text: "All Matrix" },
            }}
            series={loadingMain ? loadingSeries : ticketsChatsSeriesInfos}
            type="area"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default SupportReport;
