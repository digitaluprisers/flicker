import React, { useEffect, useState } from 'react';
import { BarChart, Phone, Calendar, UserCheck } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalCalls: 0,
    scheduledMeetings: 0,
    conversionRate: '0%'
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/calls/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={<Phone />} title="Total Calls" value={analytics.totalCalls.toString()} />
        <DashboardCard icon={<Calendar />} title="Meetings Scheduled" value={analytics.scheduledMeetings.toString()} />
        <DashboardCard icon={<UserCheck />} title="Conversion Rate" value={analytics.conversionRate} />
        <DashboardCard icon={<BarChart />} title="Revenue Generated" value="$12,345" />
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="ml-2 font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Dashboard;