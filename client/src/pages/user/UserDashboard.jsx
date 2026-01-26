import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Star, 
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../../utils/axios';
import Swal from 'sweetalert2';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    declinedServices: 0,
    completedServices: 0,
    pendingServices: 0,
    totalBills: 0,
    paidBills: 0,
    unpaidBills: 0,
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    testimonials: 0,
    servicesByType: [],
    recentActivity: [],
    monthlyStats: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [servicesRes, billsRes, testimonialsRes] = await Promise.all([
        axios.get('/api/services/user-services'),
        axios.get('/api/bills/user'),
        axios.get('/api/testimonials/my')
      ]);

      console.log('Services Response:', servicesRes.data);
      console.log('Bills Response:', billsRes.data);
      console.log('Testimonials Response:', testimonialsRes.data);

      // Extract and flatten services data from nested object structure
      const servicesDataObj = servicesRes.data.data || {};
      const servicesArray = Object.values(servicesDataObj).flat(); // Flatten all service types into one array
      
      const billsData = billsRes.data.bills || [];
      const testimonialsData = Array.isArray(testimonialsRes.data) ? testimonialsRes.data : (testimonialsRes.data.testimonials || []);

      // Ensure all are arrays
      const services = Array.isArray(servicesArray) ? servicesArray : [];
      const bills = Array.isArray(billsData) ? billsData : [];
      const testimonials = Array.isArray(testimonialsData) ? testimonialsData : [];

      console.log('Extracted services:', services);
      console.log('Extracted bills:', bills);
      console.log('Extracted testimonials:', testimonials);

      // Calculate service stats (case-insensitive status matching)
      const declinedServices = services.filter(s => s.status && s.status.toLowerCase() === 'declined').length;
      const completedServices = services.filter(s => s.status && s.status.toLowerCase() === 'completed').length;
      const pendingServices = services.filter(s => 
        s.bill && s.bill.status && s.bill.status.toLowerCase() !== 'paid'
      ).length;

      // Calculate bill stats (case-insensitive status matching)
      const paidBills = bills.filter(b => b.status && b.status.toLowerCase() === 'paid').length;
      const unpaidBills = bills.filter(b => b.status && b.status.toLowerCase() !== 'paid').length;
      const totalAmount = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
      const paidAmount = bills.filter(b => b.status && b.status.toLowerCase() === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);
      const unpaidAmount = totalAmount - paidAmount;

      // Group services by type
      const servicesByType = services.reduce((acc, service) => {
        const type = service.serviceType || 'Other';
        const existing = acc.find(item => item.name === type);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: type, value: 1 });
        }
        return acc;
      }, []);

      // Recent activity
      const recentActivity = [
        ...services.slice(0, 3).map(s => ({
          type: 'service',
          title: `${s.serviceType} service`,
          status: s.status,
          date: s.createdAt
        })),
        ...bills.slice(0, 3).map(b => ({
          type: 'bill',
          title: `Bill #${b.billNumber || b._id.slice(-6)}`,
          status: b.status,
          date: b.createdAt
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      // Monthly stats (last 6 months)
      const monthlyStats = generateMonthlyStats(services, bills);

      setStats({
        totalServices: services.length,
        declinedServices,
        completedServices,
        pendingServices,
        totalBills: bills.length,
        paidBills,
        unpaidBills,
        totalAmount,
        paidAmount,
        unpaidAmount,
        testimonials: testimonials.length,
        servicesByType,
        recentActivity,
        monthlyStats
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load dashboard data',
        confirmButtonColor: '#1f2937'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyStats = (services, bills) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const stats = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      
      const monthServices = services.filter(s => {
        const serviceMonth = new Date(s.createdAt).getMonth();
        return serviceMonth === monthIndex;
      }).length;

      const monthBills = bills.filter(b => {
        const billMonth = new Date(b.createdAt).getMonth();
        return billMonth === monthIndex;
      }).length;

      stats.push({
        month: monthName,
        services: monthServices,
        bills: monthBills
      });
    }

    return stats;
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)" }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ProgressBar = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{value}/{max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2.5 rounded-full ${color}`}
          />
        </div>
      </div>
    );
  };

  const PieChart = ({ data, colors }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No data available</p>
          </div>
        </div>
      );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90;

    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="mb-4">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startX = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const startY = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const endY = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
            const largeArcFlag = angle > 180 ? 1 : 0;

            return (
              <motion.path
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                d={`M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          <circle cx="100" cy="100" r="45" fill="white" />
          <text x="100" y="95" textAnchor="middle" className="text-2xl font-bold fill-gray-900">{total}</text>
          <text x="100" y="110" textAnchor="middle" className="text-xs fill-gray-500">Total</text>
        </svg>
        <div className="grid grid-cols-2 gap-3 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">{item.name}</p>
                <p className="text-sm font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BarChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => Math.max(d.services, d.bills)));

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span className="font-medium">{item.month}</span>
              <span>Services: {item.services} | Bills: {item.bills}</span>
            </div>
            <div className="flex gap-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.services / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded flex items-center justify-end pr-2"
              >
                {item.services > 0 && <span className="text-xs font-medium text-white">{item.services}</span>}
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.bills / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded flex items-center justify-end pr-2"
              >
                {item.bills > 0 && <span className="text-xs font-medium text-white">{item.bills}</span>}
              </motion.div>
            </div>
          </div>
        ))}
        <div className="flex gap-4 justify-center pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded" />
            <span className="text-xs text-gray-600">Services</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded" />
            <span className="text-xs text-gray-600">Bills</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Refresh
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Services"
          value={stats.totalServices}
          icon={Briefcase}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          subtitle={`${stats.activeServices} active`}
        />
        <StatCard
          title="Total Bills"
          value={stats.totalBills}
          icon={FileText}
          color="bg-gradient-to-br from-green-500 to-green-600"
          subtitle={`${stats.unpaidBills} unpaid`}
        />
        <StatCard
          title="Total Amount"
          value={`₹${(stats.totalAmount / 1000).toFixed(1)}K`}
          icon={DollarSign}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          subtitle={`₹${(stats.paidAmount / 1000).toFixed(1)}K paid`}
        />
        <StatCard
          title="Testimonials"
          value={stats.testimonials}
          icon={Star}
          color="bg-gradient-to-br from-yellow-500 to-orange-500"
          subtitle="Your reviews"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Service Status
          </h3>
          <ProgressBar
            label="Declined Services"
            value={stats.declinedServices}
            max={stats.totalServices}
            color="bg-gradient-to-r from-red-500 to-red-600"
          />
          <ProgressBar
            label="Completed Services"
            value={stats.completedServices}
            max={stats.totalServices}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <ProgressBar
            label="Payment Pending"
            value={stats.pendingServices}
            max={stats.totalServices}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
        </motion.div>

        {/* Bill Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Status
          </h3>
          <ProgressBar
            label="Paid Bills"
            value={stats.paidBills}
            max={stats.totalBills}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <ProgressBar
            label="Unpaid Bills"
            value={stats.unpaidBills}
            max={stats.totalBills}
            color="bg-gradient-to-r from-red-500 to-red-600"
          />
          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Outstanding Amount</span>
              <span className="text-xl font-bold text-red-600">₹{stats.unpaidAmount.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Services by Type & Monthly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services by Type Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Services by Type
          </h3>
          <PieChart
            data={stats.servicesByType}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']}
          />
        </motion.div>

        {/* Monthly Activity Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Activity (Last 6 Months)
          </h3>
          <BarChart data={stats.monthlyStats} />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Activity
        </h3>
        {stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'service' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {activity.type === 'service' ? <Briefcase className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' || activity.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : activity.status === 'active' || activity.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;
