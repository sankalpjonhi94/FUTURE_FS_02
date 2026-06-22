import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { getDashboardStatsApi, getActivitiesApi } from '../api/leadApi';
import { FiUsers, FiUserCheck, FiCheckSquare, FiTrendingUp, FiAward, FiXCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899'];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          getDashboardStatsApi(),
          getActivitiesApi(),
        ]);
        setStats(statsRes.data);
        setActivities(activitiesRes.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const monthlyData = stats?.monthlyLeads?.map(item => ({
    month: MONTH_NAMES[item._id.month - 1],
    leads: item.count,
  })) || [];

  const pieData = stats?.leadsByStatus?.map(item => ({
    name: item._id,
    value: item.count,
  })) || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Dashboard" />
        <main className="p-6">
          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                <DashboardCard title="Total Leads" value={stats?.totalLeads || 0} icon={FiUsers} color="blue" />
                <DashboardCard title="Customers" value={stats?.totalCustomers || 0} icon={FiUserCheck} color="green" />
                <DashboardCard title="Won Leads" value={stats?.wonLeads || 0} icon={FiAward} color="purple" />
                <DashboardCard title="Pending Tasks" value={stats?.pendingTasks || 0} icon={FiCheckSquare} color="yellow" />
                <DashboardCard title="Conversion Rate" value={`${stats?.conversionRate || 0}%`} icon={FiTrendingUp} color="green" />
                <DashboardCard title="Lost Leads" value={stats?.lostLeads || 0} icon={FiXCircle} color="red" />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="card">
                  <h3 className="text-base font-semibold text-gray-700 mb-4">Monthly Leads (Last 6 months)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="leads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 className="text-base font-semibold text-gray-700 mb-4">Leads by Status</h3>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                          {pieData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400">No data yet</div>
                  )}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="card">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Recent Activities</h3>
                {activities.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">No recent activities</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {activity.performedBy?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            by {activity.performedBy?.name} · {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
