import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import ImageModal from "../../../components/ImageModal";

const subTabs = [
  { key: "filing", label: "ITR Filing", endpoint: "/api/itr-filing" },
  {
    key: "document_prep",
    label: "Document Preparation",
    endpoint: "/api/itr-document-prep",
  },
  {
    key: "refund_notice",
    label: "Refund Notice",
    endpoint: "/api/itr-refund-notice",
  },
];

const columns = {
  filing: [
    "user",
    "pan",
    "itrType",
    "annualIncome",
    "notes",
    "documents",
    "createdAt",
  ],
  document_prep: ["user", "documentType", "notes", "documents", "createdAt"],
  refund_notice: [
    "user",
    "pan",
    "refundYear",
    "noticeType",
    "notes",
    "documents",
    "createdAt",
  ],
};

const AdminITR = () => {
  const [activeTab, setActiveTab] = useState("filing");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search and filter state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Image modal state
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: "",
    title: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          subTabs.find((t) => t.key === activeTab).endpoint + "/all"
        );
        if (res.data && Array.isArray(res.data.data)) {
          setData(res.data.data);
        } else if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching ITR data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // Filtered data
  const filteredData = data
    .filter((row) => {
      const searchStr = search.toLowerCase();
      return columns[activeTab].some((col) => {
        if (col === "user") {
          const user = row.userId || {};
          return (
            (user.name || "").toLowerCase().includes(searchStr) ||
            (user.email || "").toLowerCase().includes(searchStr) ||
            (user.phone || "").toLowerCase().includes(searchStr)
          );
        }
        return (row[col] || "").toString().toLowerCase().includes(searchStr);
      });
    })
    .filter((row) => {
      if (!filter) return true;
      if (row.pan) return row.pan.toLowerCase().includes(filter.toLowerCase());
      return true;
    });

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to format column names
  const formatColHeader = (col) => {
    if (col === "user") return "USER DETAILS";
    if (col === "pan") return "PAN";
    if (col === "itrType") return "ITR Type";
    if (col === "annualIncome") return "Annual Income";
    if (col === "documentType") return "Document Type";
    if (col === "refundYear") return "Refund Year";
    if (col === "noticeType") return "Notice Type";
    if (col === "documentPath" || col === "documents") return "DOCUMENTS";
    if (col === "createdAt") return "Created At";
    if (col === "notes") return "NOTES";
    // Capitalize first letter and add spaces before uppercase letters
    return col.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  };

  // Handle viewing document image
  const handleViewDocument = (row) => {
    if (row.documentUrl) {
      setImageModal({
        isOpen: true,
        imageUrl: row.documentUrl,
        title: `ITR Document - ${row.userId?.name || "Unknown"}`,
      });
    }
  };

  // Close image modal
  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      imageUrl: "",
      title: "",
    });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        subTabs.find((t) => t.key === activeTab).endpoint + "/all"
      );
      if (res.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching ITR data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <div className="max-w-[960px] mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              ITR Service Requests
            </h2>
            <p className="text-gray-600">
              Manage and review all Income Tax Return service requests
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-5 py-3 rounded-t-lg cursor-pointer font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white border-t border-l border-r border-gray-200 text-green-600 shadow-sm relative"
                  : "text-gray-500 hover:text-green-500 hover:bg-green-50"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100 w-full">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search across all fields..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>

            <div className="w-full md:w-56">
              <input
                type="text"
                placeholder="Filter by PAN"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden sm:inline">
                {filteredData.length} results
              </span>
              {filter && (
                <button
                  onClick={() => setFilter("")}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
                >
                  Clear filter
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border w-full border-gray-100">
          {loading ? (
            // Skeleton loading screen
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <table className="w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                        S.No
                      </th>
                      {columns[activeTab].map((col) => (
                        <th
                          key={col}
                          className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 ${
                            col === "user"
                              ? "w-56"
                              : col === "filingType" ||
                                col === "employmentType" ||
                                col === "noticeType"
                              ? "w-36"
                              : col === "annualIncome"
                              ? "w-32"
                              : col === "query" ||
                                col === "notes" ||
                                col === "description"
                              ? "w-64"
                              : col === "documentPath" || col === "documents"
                              ? "w-32"
                              : col === "createdAt"
                              ? "w-44"
                              : "w-32"
                          }`}
                        >
                          {formatColHeader(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns[activeTab].length + 1}
                          className="px-6 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <svg
                              className="w-16 h-16 mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <p className="text-lg font-medium">
                              No records found
                            </p>
                            <p className="mt-1 max-w-md">
                              Try adjusting your search or filter to find what
                              you're looking for.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row, idx) => (
                        <tr
                          key={row._id || idx}
                          className="hover:bg-green-50 transition-colors duration-150"
                        >
                          <td className="w-16 px-4 py-4 text-sm text-gray-700 border-r border-gray-200 font-semibold">
                            {idx + 1}
                          </td>
                          {columns[activeTab].map((col) => (
                            <td
                              key={col}
                              className={`px-4 py-4 text-sm text-gray-700 border-r border-gray-200 ${
                                col === "user"
                                  ? "w-56"
                                  : col === "filingType" ||
                                    col === "employmentType" ||
                                    col === "noticeType"
                                  ? "w-36"
                                  : col === "annualIncome"
                                  ? "w-32"
                                  : col === "query" ||
                                    col === "notes" ||
                                    col === "description"
                                  ? "w-64"
                                  : col === "documentPath" ||
                                    col === "documents"
                                  ? "w-32"
                                  : col === "createdAt"
                                  ? "w-44"
                                  : "w-32"
                              }`}
                            >
                              <div className="overflow-hidden">
                                {col === "user" ? (
                                  <div className="space-y-1">
                                    <div className="font-medium text-gray-900 truncate">
                                      {row.userId?.name || "-"}
                                    </div>
                                    <div className="text-gray-500 truncate">
                                      <a
                                        href={`mailto:${row.userId?.email}`}
                                        className="hover:text-green-600"
                                        title={row.userId?.email}
                                      >
                                        {row.userId?.email || "-"}
                                      </a>
                                    </div>
                                    <div className="text-gray-500 truncate">
                                      <a
                                        href={`tel:${row.userId?.phone}`}
                                        className="hover:text-green-600"
                                      >
                                        {row.userId?.phone || "-"}
                                      </a>
                                    </div>
                                  </div>
                                ) : col === "createdAt" ? (
                                  <span className="text-gray-500 block truncate">
                                    {formatDate(row[col])}
                                  </span>
                                ) : col === "documents" ? (
                                  row.documentUrl ? (
                                    <button
                                      onClick={() => handleViewDocument(row)}
                                      className="text-green-600 hover:text-green-800 cursor-pointer flex items-center gap-1 truncate"
                                    >
                                      <svg
                                        className="w-4 h-4 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        ></path>
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        ></path>
                                      </svg>
                                      <span className="truncate">
                                        View Image
                                      </span>
                                    </button>
                                  ) : (
                                    <span className="block truncate">-</span>
                                  )
                                ) : col === "annualIncome" ? (
                                  <span
                                    className="block truncate"
                                    title={
                                      row[col]
                                        ? `₹${parseInt(row[col]).toLocaleString(
                                            "en-IN"
                                          )}`
                                        : "-"
                                    }
                                  >
                                    {row[col]
                                      ? `₹${parseInt(row[col]).toLocaleString(
                                          "en-IN"
                                        )}`
                                      : "-"}
                                  </span>
                                ) : (
                                  <span
                                    className="block truncate"
                                    title={row[col]}
                                  >
                                    {row[col] || "-"}
                                  </span>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Image Modal */}
        <ImageModal
          isOpen={imageModal.isOpen}
          onClose={closeImageModal}
          imageUrl={imageModal.imageUrl}
          title={imageModal.title}
        />
      </div>
    </div>
  );
};

export default AdminITR;
