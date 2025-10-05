import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import {
  FaChartBar,
  FaSearch,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";
import { FiUsers, FiFileText } from "react-icons/fi";

const ReportsPage = () => {
  // For custom date range
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const PAGE_SIZE = 7;
  const [userPage, setUserPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [activeTab, setActiveTab] = useState("users");
  const [dateRange, setDateRange] = useState("last30");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        if (activeTab === "users") {
          const res = await axios.get("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data);
        } else {
          const res = await axios.get("/api/admin/services-report", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setServices(res.data);
        }
      } catch (err) {
        // handle error
      }
      setLoading(false);
    };
    fetchData();
    setUserPage(1);
    setServicePage(1);
  }, [activeTab]);

  // Download Excel helper
  const downloadExcel = async (type) => {
    const endpoint =
      type === "users"
        ? "/api/admin/export-users-excel"
        : "/api/admin/export-services-excel";
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(endpoint, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        type === "users" ? "users_report.xlsx" : "services_report.xlsx"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to export report.");
    }
  };

  const reportTypes = [
    { id: "users", name: "User Reports", icon: <FiUsers className="mr-2" /> },
    {
      id: "services",
      name: "Service Reports",
      icon: <FiFileText className="mr-2" />,
    },
  ];

  // Helper to get date range
  const getDateRange = () => {
    const now = new Date();
    let start = null,
      end = null;
    if (dateRange === "last7") {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      end = now;
    } else if (dateRange === "last30") {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      end = now;
    } else if (dateRange === "last90") {
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      end = now;
    } else if (dateRange === "custom" && customStart && customEnd) {
      start = new Date(customStart);
      end = new Date(customEnd);
      end.setHours(23, 59, 59, 999); // include full end day
    }
    return { start, end };
  };

  // Filter by date
  const { start, end } = getDateRange();
  const filterByDate = (createdAt) => {
    if (!start || !end) return true;
    const date = new Date(createdAt);
    return date >= start && date <= end;
  };

  // Filtered data based on searchQuery and date
  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (user.name || user.given_name || user.first_name || "")
        .toLowerCase()
        .includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.phone || user.mobile || "").toString().toLowerCase().includes(q);
    return matchesSearch && filterByDate(user.createdAt);
  });
  const filteredServices = services.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (item.type || "").toLowerCase().includes(q) ||
      (item.name || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.mobile || item.phone || "").toString().toLowerCase().includes(q);
    return matchesSearch && filterByDate(item.createdAt);
  });

  return (
    <div className="w-full min-h-screen p-4 md:p-4 md:ml-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaChartBar className="text-2xl text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Reports & Analytics
            </h1>
          </div>
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <input
                type="date"
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </div>
          )}

          <div className="ml-auto">
            {activeTab === "users" && (
              <button
                className="flex items-center cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                onClick={() => downloadExcel("users")}
              >
                <FaDownload /> Export Users to Excel
              </button>
            )}
            {activeTab === "services" && (
              <button
                className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                onClick={() => downloadExcel("services")}
              >
                <FaDownload /> Export Services to Excel
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {reportTypes.map((tab) => (
              <button
                key={tab.id}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content: Table for Users/Services */}
        <div className="bg-gray-50 rounded-xl p-6 min-h-[300px]">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : activeTab === "users" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers
                      .slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE)
                      .map((user) => (
                        <tr key={user._id}>
                          <td className="px-4 py-2 border">
                            {user.name ||
                              user.given_name ||
                              user.first_name ||
                              ""}
                          </td>
                          <td className="px-4 py-2 border">{user.email}</td>
                          <td className="px-4 py-2 border">
                            {user.phone || user.mobile || ""}
                          </td>
                          <td className="px-4 py-2 border">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleString()
                              : ""}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-4 gap-2">
                <button
                  className="px-3 py-1 rounded cursor-pointer bg-gray-200 hover:bg-gray-300"
                  disabled={userPage === 1}
                  onClick={() => setUserPage(userPage - 1)}
                >
                  Prev
                </button>
                <span>
                  Page {userPage} of{" "}
                  {Math.ceil(filteredUsers.length / PAGE_SIZE) || 1}
                </span>
                <button
                  className="px-3 py-1 rounded cursor-pointer bg-gray-200 hover:bg-gray-300"
                  disabled={
                    userPage === Math.ceil(filteredUsers.length / PAGE_SIZE) ||
                    filteredUsers.length === 0
                  }
                  onClick={() => setUserPage(userPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Service Type</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500"
                      >
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredServices
                      .slice(
                        (servicePage - 1) * PAGE_SIZE,
                        servicePage * PAGE_SIZE
                      )
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 border">{item.type}</td>
                          <td className="px-4 py-2 border">{item.name}</td>
                          <td className="px-4 py-2 border">{item.email}</td>
                          <td className="px-4 py-2 border">
                            {item.mobile || item.phone || ""}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : ""}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-4 gap-2">
                <button
                  className="px-3 py-1 cursor-pointer rounded bg-gray-200 hover:bg-gray-300"
                  disabled={servicePage === 1}
                  onClick={() => setServicePage(servicePage - 1)}
                >
                  Prev
                </button>
                <span>
                  Page {servicePage} of{" "}
                  {Math.ceil(filteredServices.length / PAGE_SIZE) || 1}
                </span>
                <button
                  className="px-3 py-1 cursor-pointer rounded bg-gray-200 hover:bg-gray-300"
                  disabled={
                    servicePage ===
                      Math.ceil(filteredServices.length / PAGE_SIZE) ||
                    filteredServices.length === 0
                  }
                  onClick={() => setServicePage(servicePage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
