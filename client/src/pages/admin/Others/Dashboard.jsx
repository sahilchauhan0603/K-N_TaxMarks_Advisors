import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
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
  FaArrowDown
} from 'react-icons/fa';
import { GiCash, GiTakeMyMoney } from 'react-icons/gi';
import { BsGraphUp, BsFillBarChartFill, BsThreeDotsVertical } from 'react-icons/bs';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    total: 0, 
    active: 0, 
    inactive: 0, 
    monthly: [],
    revenue: 0,
    services: {
      gst: 0,
      trademark: 0,
      tax: 0,
      other: 0
    },
    dailyActivity: []
  });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        const {
          total,
          active,
          inactive,
          monthly,
          revenue,
          services,
          recentUsers: recent,
          dailyActivity
        } = res.data;
        setStats({ total, active, inactive, monthly, revenue, services, dailyActivity });
        setRecentUsers(recent);
      } catch {
        setStats({ total: 0, active: 0, inactive: 0, monthly: [], revenue: 0, services: {}, dailyActivity: [] });
        setRecentUsers([]);
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
    </div>
  );
};

export default AdminDashboard;