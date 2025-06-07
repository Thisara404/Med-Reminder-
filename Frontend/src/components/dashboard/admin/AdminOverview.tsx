import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/adminService';
import { 
  Users2Icon, 
  UserCogIcon, 
  PillIcon, 
  TrendingUpIcon,
  AlertCircleIcon 
} from 'lucide-react';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={<UserCogIcon />}
          color="blue"
        />
        <StatCard
          title="Total Caregivers"
          value={stats.totalCaregivers}
          icon={<Users2Icon />}
          color="green"
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users2Icon />}
          color="purple"
        />
        <StatCard
          title="Total Medications"
          value={stats.totalMedications}
          icon={<PillIcon />}
          color="yellow"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {stats.recentActivities.map((activity: any) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`bg-${color}-100 p-3 rounded-full`}>
        {React.cloneElement(icon as React.ReactElement, { 
          className: `text-${color}-600`,
          size: 24 
        })}
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className={`text-2xl font-semibold text-${color}-600`}>{value}</p>
      </div>
    </div>
  </div>
);

const ActivityItem: React.FC<{ activity: any }> = ({ activity }) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
    <div className="mr-4">
      {getActivityIcon(activity.type)}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
      <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
    </div>
  </div>
);

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'NEW_DOCTOR':
      return <UserCogIcon className="text-blue-500" />;
    case 'NEW_CAREGIVER':
      return <Users2Icon className="text-green-500" />;
    case 'NEW_PATIENT':
      return <Users2Icon className="text-purple-500" />;
    default:
      return <AlertCircleIcon className="text-gray-500" />;
  }
};

export default AdminOverview;