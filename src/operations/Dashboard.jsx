import React from 'react';
import { 
  Users, 
  CreditCard, 
  Bell, 
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
// import StdDisplay from '../users/StdDisplay';
// import PayDisplay from '../users/PayDisplay';
// import UpDisplay from '../users/UpDisplay';

const colors = {
  primary: '#1A3C40',    // Deep Forest Green
  secondary: '#417D7A',  // Muted Teal
  accent: '#9DC3C1',     // Soft Mint
  success: '#22C55E',    // Green
  danger: '#EF4444',     // Red
  background: '#F5F7F8', // Light Gray
  text: '#2D2D2D',       // Dark Gray
  lightText: '#5D5D5D'   // Medium Gray
};

function MetricCard({ title, value, icon: Icon, trend, trendValue }) {
  const isPositive = trendValue >= 0;
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-gray-100 p-2">
          <Icon className="h-6 w-6" style={{ color: colors.primary }} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="ml-1">{Math.abs(trendValue)}%</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-600">{title}</h3>
      <p className="mt-2 text-3xl font-bold" style={{ color: colors.primary }}>{value}</p>
    </div>
  );
}

function StatisticRow({ label, value, percentage }) {
  const barWidth = `${Math.min(percentage, 100)}%`;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full transition-all duration-500"
          style={{ width: barWidth, backgroundColor: colors.primary }}
        ></div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6" style={{ backgroundColor: colors.background }}>
      {/* Header Section */}
      <div className="rounded-xl p-6 shadow-md" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">MediZone Dashboard</h1>
            <p className="mt-2 text-sm" style={{ color: colors.accent }}>
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Students" 
          value="1,234" 
          icon={Users}
          trend
          trendValue={12.5}
        />
        <MetricCard 
          title="Total Payments" 
          value="$12,345" 
          icon={CreditCard}
          trend
          trendValue={-2.4}
        />
        <MetricCard 
          title="Active Updates" 
          value="24" 
          icon={Bell}
          trend
          trendValue={5.8}
        />
        <MetricCard 
          title="Registered Hospitals" 
          value="15" 
          icon={Building2}
          trend
          trendValue={8.3}
        />
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Progress Bars */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold" style={{ color: colors.primary }}>
            Monthly Progress
          </h2>
          <StatisticRow 
            label="Student Enrollment" 
            value="85%" 
            percentage={85}
          />
          <StatisticRow 
            label="Payment Collection" 
            value="92%" 
            percentage={92}
          />
          <StatisticRow 
            label="Hospital Registration" 
            value="78%" 
            percentage={78}
          />
          <StatisticRow 
            label="Update Completion" 
            value="95%" 
            percentage={95}
          />
        </div>

        {/* Quick Stats */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold" style={{ color: colors.primary }}>
            Quick Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">New Students</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: colors.primary }}>+124</p>
              <p className="text-xs text-green-600">↑ 12% this month</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: colors.primary }}>$45.2k</p>
              <p className="text-xs text-green-600">↑ 8% this month</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: colors.primary }}>892</p>
              <p className="text-xs text-green-600">↑ 15% this month</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: colors.primary }}>94%</p>
              <p className="text-xs text-green-600">↑ 2% this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="space-y-6">
        {/* Students List */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: colors.primary }}>
              Recent Students
            </h2>
          </div>
          <div className="overflow-x-auto">
            {/* <StdDisplay /> */}
          </div>
        </div>

        {/* Payments List */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: colors.primary }}>
              Recent Payments
            </h2>
          </div>
          <div className="overflow-x-auto">
            {/* <PayDisplay /> */}
          </div>
        </div>

        {/* Updates List */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: colors.primary }}>
              Latest Updates
            </h2>
          </div>
          <div className="overflow-x-auto">
            {/* <UpDisplay /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;