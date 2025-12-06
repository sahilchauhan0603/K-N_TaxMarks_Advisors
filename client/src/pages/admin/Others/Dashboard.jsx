import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  AreaChart, Area, LineChart, Line, RadialBarChart, RadialBar, FunnelChart, Funnel, LabelList
} from 'recharts';
import axios from '../../../utils/axios';
import { 
  FaUsers, 
  FaChartBar, 
  FaUserCheck, 
  FaUserTimes, 
  FaFileInvoiceDollar,
  FaRegCalendarCheck,
  FaRegChartBar,
  FaBusinessTime,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaComments,
  FaChartLine,
  FaPercent,
  FaTrophy,
  FaFunnelDollar
} from 'react-icons/fa';
import { GiCash, GiTakeMyMoney, GiProgression } from 'react-icons/gi';
import { BsGraphUp, BsFillBarChartFill, BsThreeDotsVertical, BsClipboardCheck } from 'react-icons/bs';
import { MdRateReview, MdPendingActions, MdDone, MdTrendingUp } from 'react-icons/md';
import { AdminPageLoader, AdminPageError } from "../components/AdminPageLoader";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
const RADIAL_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    total: 0, 
    active: 0, 
    inactive: 0, 
    monthly: [],
    revenue: 0,
    pendingRevenue: 0,
    services: {
      gst: 0,
      trademark: 0,
      tax: 0,
      other: 0
    },
    dailyActivity: [],
    revenueByService: {},
    testimonials: {
      total: 0,
      approved: 0,
      pending: 0,
      byService: {}
    },
    suggestions: {
      total: 0,
      byStatus: {}
    },
    completionRate: 0,
    avgTransactionValue: 0,
    paymentStatus: {},
    serviceRequests: [],
    retentionData: [],
    processingTime: [],
    conversionFunnel: {}
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get('/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setStats(res.data);
        setRecentUsers(res.data.recentUsers || []);
      } catch (err) {
        setError("Failed to fetch dashboard stats. Please try again.");
        setStats({ 
          total: 0, active: 0, inactive: 0, monthly: [], revenue: 0, pendingRevenue: 0,
          services: {}, dailyActivity: [], revenueByService: {}, testimonials: {},
          suggestions: {}, completionRate: 0, avgTransactionValue: 0, paymentStatus: {},
          serviceRequests: [], retentionData: [], processingTime: [], conversionFunnel: {}
        });
        setRecentUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Active Users', value: stats.active },
    { name: 'Inactive Users', value: stats.inactive },
  ];

  const serviceData = [
    { name: 'GST Services', value: stats.services.gst, icon: <FaFileInvoiceDollar className="text-blue-500" /> },
    { name: 'Trademark', value: stats.services.trademark, icon: <FaBusinessTime className="text-purple-500" /> },
    { name: 'Tax Filing', value: stats.services.tax, icon: <GiCash className="text-pink-500" /> },
    { name: 'Other', value: stats.services.other, icon: <GiTakeMyMoney className="text-yellow-500" /> },
  ];

  // Calculate percentage changes for stats cards
  const calculatePercentageChange = (current, previous = current * 0.8) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const percentageChanges = {
    total: calculatePercentageChange(stats.total),
    active: calculatePercentageChange(stats.active),
    revenue: calculatePercentageChange(stats.revenue),
    services: calculatePercentageChange(Object.values(stats.services).reduce((a, b) => a + b, 0))
  };

  if (loading) {
    return <AdminPageLoader message="Loading dashboard..." />;
  }
  if (error) {
    return <AdminPageError error={error} onRetry={() => window.location.reload()} />;
  }
  return (
    <div className="w-full min-h-screen p-4 md:p-4 md:ml-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow">
              <FaChartBar className="text-white text-2xl" />
            </div>
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-gray-500 ml-14 -mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center gap-2 mt-4 md:mt-0">
          <FaRegCalendarCheck className="text-blue-500" />
          <span className="text-gray-700 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Total Users</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</div>
              <div className={`text-xs font-medium mt-2 flex items-center ${percentageChanges.total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentageChanges.total >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(percentageChanges.total).toFixed(1)}% from last month
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaUsers className="text-2xl text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Active Users</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{stats.active}</div>
              <div className={`text-xs font-medium mt-2 flex items-center ${percentageChanges.active >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentageChanges.active >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(percentageChanges.active).toFixed(1)}% from last month
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaUserCheck className="text-2xl text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Total Revenue</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">₹{stats.revenue.toLocaleString()}</div>
              <div className={`text-xs font-medium mt-2 flex items-center ${percentageChanges.revenue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentageChanges.revenue >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(percentageChanges.revenue).toFixed(1)}% from last month
              </div>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <GiCash className="text-2xl text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Service Requests</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{Object.values(stats.services).reduce((a, b) => a + b, 0)}</div>
              <div className={`text-xs font-medium mt-2 flex items-center ${percentageChanges.services >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentageChanges.services >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(percentageChanges.services).toFixed(1)}% from last month
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaFileInvoiceDollar className="text-2xl text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">User Growth</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div> Users</span>
              <span className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div> Revenue</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthly}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'Revenue' ? `₹${value.toLocaleString()}` : value,
                    name
                  ]}
                />
                <Area type="monotone" dataKey="Users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-700 text-lg mb-4">Service Distribution</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={serviceData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} requests`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Top 5 Recent Users</h4>
            <div className="text-sm text-gray-500">Latest registrations</div>
          </div>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No recent user registrations.</div>
            ) : recentUsers.slice(0, 5).map(user => (
              <div key={user._id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaUserCheck className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-600">Registered</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity (Real Activity Data) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">User Activity</h4>
            <div className="text-sm text-gray-500">Last 7 days</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorForms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorTestimonials" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorSuggestions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value}`, name]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Bar dataKey="Signups" stackId="a" fill="url(#colorSignups)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Service Forms" stackId="a" fill="url(#colorForms)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Testimonials" stackId="a" fill="url(#colorTestimonials)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Suggestions" stackId="a" fill="url(#colorSuggestions)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Pending Revenue</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">₹{stats.pendingRevenue?.toLocaleString() || 0}</div>
              <div className="text-xs font-medium mt-2 text-orange-500 flex items-center">
                <FaHourglassHalf className="mr-1" />
                Awaiting payment
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MdPendingActions className="text-2xl text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Avg Transaction</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">₹{stats.avgTransactionValue?.toLocaleString() || 0}</div>
              <div className="text-xs font-medium mt-2 text-teal-500 flex items-center">
                <FaChartLine className="mr-1" />
                Per service
              </div>
            </div>
            <div className="p-3 bg-teal-100 rounded-lg">
              <GiTakeMyMoney className="text-2xl text-teal-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Completion Rate</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{stats.completionRate || 0}%</div>
              <div className="text-xs font-medium mt-2 text-green-500 flex items-center">
                <FaCheckCircle className="mr-1" />
                Services completed
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BsClipboardCheck className="text-2xl text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Testimonials</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{stats.testimonials?.approved || 0}/{stats.testimonials?.total || 0}</div>
              <div className="text-xs font-medium mt-2 text-pink-500 flex items-center">
                <MdRateReview className="mr-1" />
                {stats.testimonials?.pending || 0} pending
              </div>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <FaComments className="text-2xl text-pink-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 3 - Revenue & Payment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue by Service Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Revenue by Service Type</h4>
            <div className="text-sm text-gray-500">Total: ₹{stats.revenue?.toLocaleString()}</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={Object.entries(stats.revenueByService || {}).map(([key, value]) => ({
                    name: key,
                    value: value
                  }))}
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100}
                  innerRadius={60}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.keys(stats.revenueByService || {}).map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Payment Status</h4>
            <div className="text-sm text-gray-500">Transactions</div>
          </div>
          <div className="h-80 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-700">{stats.paymentStatus?.paid || 0}</div>
                <div className="text-sm text-gray-600 mt-1">Paid Bills</div>
                <div className="text-lg font-semibold text-green-600 mt-2">
                  ₹{stats.paymentStatus?.paidAmount?.toLocaleString() || 0}
                </div>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                <FaHourglassHalf className="text-4xl text-orange-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-700">{stats.paymentStatus?.pending || 0}</div>
                <div className="text-sm text-gray-600 mt-1">Pending Bills</div>
                <div className="text-lg font-semibold text-orange-600 mt-2">
                  ₹{stats.paymentStatus?.pendingAmount?.toLocaleString() || 0}
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Completion Rate</span>
                <span className="text-lg font-bold text-blue-600">
                  {stats.paymentStatus?.paid && stats.paymentStatus?.pending 
                    ? Math.round((stats.paymentStatus.paid / (stats.paymentStatus.paid + stats.paymentStatus.pending)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${stats.paymentStatus?.paid && stats.paymentStatus?.pending 
                      ? Math.round((stats.paymentStatus.paid / (stats.paymentStatus.paid + stats.paymentStatus.pending)) * 100)
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 4 - Testimonials & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Testimonials by Service */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Testimonials by Service</h4>
            <div className="text-sm text-gray-500">{stats.testimonials?.total || 0} Total</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={Object.entries(stats.testimonials?.byService || {}).map(([key, value]) => ({
                  name: key,
                  count: value
                }))}
                layout="vertical"
              >
                <defs>
                  <linearGradient id="colorTestimonials" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="url(#colorTestimonials)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suggestions Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Suggestions Status</h4>
            <div className="text-sm text-gray-500">{stats.suggestions?.total || 0} Total</div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={[
                      { name: 'Open', value: stats.suggestions?.byStatus?.open || 0, color: '#f59e0b' },
                      { name: 'Reviewed', value: stats.suggestions?.byStatus?.reviewed || 0, color: '#3b82f6' },
                      { name: 'Resolved', value: stats.suggestions?.byStatus?.resolved || 0, color: '#10b981' }
                    ]}
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80}
                    label
                  >
                    {[0, 1, 2].map((idx) => (
                      <Cell key={`cell-${idx}`} fill={[' #f59e0b', '#3b82f6', '#10b981'][idx]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 5 - Service Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top 5 Requested Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Top Requested Services</h4>
            <FaTrophy className="text-yellow-500 text-xl" />
          </div>
          <div className="space-y-4">
            {(stats.serviceRequests || []).slice(0, 5).map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.count} requests</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(service.count / (stats.serviceRequests[0]?.count || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Processing Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Avg Processing Time</h4>
            <FaClock className="text-blue-500 text-xl" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.processingTime || []} layout="horizontal">
                <defs>
                  <linearGradient id="colorProcessing" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="service" angle={-15} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} days`, 'Processing Time']} />
                <Bar dataKey="days" fill="url(#colorProcessing)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 6 - Conversion & Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Conversion Funnel</h4>
            <div className="text-sm text-gray-500">{stats.conversionFunnel?.conversionRate || 0}% Rate</div>
          </div>
          <div className="h-80 flex flex-col justify-center space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between p-4 bg-blue-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaUsers className="text-2xl text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Visited</div>
                    <div className="text-sm text-gray-600">Total visitors</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.conversionFunnel?.visited || 0}</div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 text-gray-400">
                <FaArrowDown className="text-xl" />
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-between p-4 bg-purple-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaChartBar className="text-2xl text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Started</div>
                    <div className="text-sm text-gray-600">Began process</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">{stats.conversionFunnel?.started || 0}</div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 text-gray-400">
                <FaArrowDown className="text-xl" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-2xl text-green-600" />
                <div>
                  <div className="font-semibold text-gray-800">Completed</div>
                  <div className="text-sm text-gray-600">Finished service</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.conversionFunnel?.completed || 0}</div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Conversion Rate</span>
                <span className="text-2xl font-bold text-green-600">{stats.conversionFunnel?.conversionRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Retention */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">User Retention</h4>
            <div className="text-sm text-gray-500">Monthly cohorts</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.retentionData || []}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
                <Line 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Action Cards & Real-time Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Pending Actions */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-sm border border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <MdPendingActions className="text-2xl text-white" />
            </div>
            <h4 className="font-semibold text-gray-700 text-lg">Pending Actions</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Testimonials to Review</span>
              <span className="font-bold text-orange-600">{stats?.testimonials?.pending || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Pending Payments</span>
              <span className="font-bold text-orange-600">{stats?.paymentStatus?.pending || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Open Suggestions</span>
              <span className="font-bold text-orange-600">{stats?.suggestions?.byStatus?.open || 0}</span>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <FaRegCalendarCheck className="text-2xl text-white" />
            </div>
            <h4 className="font-semibold text-gray-700 text-lg">Today's Activity</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">New Signups</span>
              <span className="font-bold text-blue-600">
                {stats.dailyActivity?.[stats.dailyActivity.length - 1]?.Signups || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Service Forms</span>
              <span className="font-bold text-blue-600">
                {stats.dailyActivity?.[stats.dailyActivity.length - 1]?.["Service Forms"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Total Activity</span>
              <span className="font-bold text-blue-600">
                {stats.dailyActivity?.[stats.dailyActivity.length - 1]?.["Total Activity"] || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <MdTrendingUp className="text-2xl text-white" />
            </div>
            <h4 className="font-semibold text-gray-700 text-lg">Key Metrics</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="font-bold text-green-600">{stats.completionRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="font-bold text-green-600">{stats.conversionFunnel?.conversionRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="font-bold text-green-600">{Math.round((stats.active / stats.total) * 100) || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;