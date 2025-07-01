import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
import axios from '../../utils/axios';
import { 
  FaUsers, 
  FaChartBar, 
  FaUserCheck, 
  FaUserTimes, 
  FaFileInvoiceDollar,
  FaRegCalendarCheck,
  FaRegChartBar,
  FaBusinessTime
} from 'react-icons/fa';
import { GiCash, GiTakeMyMoney } from 'react-icons/gi';
import { BsGraphUp, BsFillBarChartFill } from 'react-icons/bs';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

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
    }
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
          recentUsers: recent
        } = res.data;
        setStats({ total, active, inactive, monthly, revenue, services });
        setRecentUsers(recent);
      } catch {
        setStats({ total: 0, active: 0, inactive: 0, monthly: [], revenue: 0, services: {} });
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

  return (
    <div className="admin-dashboard w-full min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow">
            <FaChartBar className="text-white text-2xl" />
          </div>
          <span>Admin Dashboard</span>
        </h1>
        <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center gap-2">
          <FaRegCalendarCheck className="text-blue-500" />
          <span className="text-gray-700 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium opacity-80">Total Users</div>
              <div className="text-3xl font-bold mt-1">{stats.total}</div>
            </div>
            <div className="p-3 bg-blue-400 bg-opacity-20 rounded-lg">
              <FaUsers className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium opacity-80 flex items-center">
            <BsGraphUp className="mr-1" /> 12% increase from last month
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium opacity-80">Active Users</div>
              <div className="text-3xl font-bold mt-1">{stats.active}</div>
            </div>
            <div className="p-3 bg-green-400 bg-opacity-20 rounded-lg">
              <FaUserCheck className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium opacity-80 flex items-center">
            <BsGraphUp className="mr-1" /> 8% increase from last month
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium opacity-80">Total Revenue</div>
              <div className="text-3xl font-bold mt-1">₹{stats.revenue.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-amber-400 bg-opacity-20 rounded-lg">
              <GiCash className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium opacity-80 flex items-center">
            <BsGraphUp className="mr-1" /> 22% increase from last month
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium opacity-80">Service Requests</div>
              <div className="text-3xl font-bold mt-1">{Object.values(stats.services).reduce((a, b) => a + b, 0)}</div>
            </div>
            <div className="p-3 bg-purple-400 bg-opacity-20 rounded-lg">
              <FaFileInvoiceDollar className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium opacity-80 flex items-center">
            <BsGraphUp className="mr-1" /> 15% increase from last month
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="Users" stroke="#3b82f6" fill="#93c5fd" />
                <Area type="monotone" dataKey="Revenue" stroke="#10b981" fill="#a7f3d0" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
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
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h4 className="font-semibold text-gray-700 text-lg mb-4">Recent Activity</h4>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <div className="text-gray-400 text-center">No recent users.</div>
            ) : recentUsers.map(user => (
              <div key={user._id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaUserCheck className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-600">Registered</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
                <div className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 text-lg">Monthly Revenue</h4>
            <div className="text-sm text-gray-500">Last 6 months</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthly}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;