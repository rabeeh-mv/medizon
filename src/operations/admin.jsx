import React, { useState } from 'react';
import { 
  Home,
  UserPlus,
  PlusSquare,
  CreditCard,
  Building2,
  ChevronRight,
  Menu,
  LucideSquareGanttChart
} from 'lucide-react';
import Dashboard from './Dashboard';
import Addstd from '../Addstd/Addstd';
import AddUpdates from '../Updates/AddUpdates';
import Hospitals from '../Hospital/hospitals';
import Payment from '../payment/payment'
import StudentMedical from '../Status/StudentMedical'
const colors = {
  primary: '#0F766E',    // Deeper teal for better contrast
  secondary: '#14B8A6',  // Brighter teal for accents
  accent: '#F43F5E',     // Vibrant rose for highlights
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B'
};

function Admin() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: Home, component: 'dashboard' },
    { label: 'Add Student', icon: UserPlus, component: 'student' },
    { label: 'Add Updates', icon: PlusSquare, component: 'Updates' },
    { label: 'Student status', icon: LucideSquareGanttChart, component: 'status' },
    { label: 'Payment', icon: CreditCard, component: 'payment' },
    { label: 'Add Hospital', icon: Building2, component: 'hospital' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      <button
        className="fixed right-4 top-4 z-50 rounded-lg p-2 text-white sm:hidden"
        style={{ backgroundColor: colors.primary }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          sm:relative sm:translate-x-0`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: colors.primary }}>
            MediZone Admin
          </h1>
        </div>
        
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const isActive = activeComponent === item.component;
            return (
              <div
                key={item.component}
                className={`group flex cursor-pointer items-center rounded-lg px-4 py-3 transition-all
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-700 hover:bg-gray-50'}`}
                style={{
                  backgroundColor: isActive ? colors.primary : 'transparent'
                }}
                onClick={() => {
                  setActiveComponent(item.component);
                  setIsSidebarOpen(false);
                }}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 transition-colors
                    ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`}
                />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <ChevronRight 
                  className={`h-4 w-4 opacity-0 transition-opacity
                    ${isActive ? 'text-white opacity-100' : 'text-gray-400 group-hover:opacity-100'}`}
                />
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-x-hidden">
        <div className="m-4 sm:m-6 rounded-xl bg-white shadow-sm">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {menuItems.find(item => item.component === activeComponent)?.label}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {activeComponent === 'dashboard' 
                  ? 'Overview and key metrics' 
                  : `Manage ${activeComponent.toLowerCase()} information and settings`}
              </p>
            </div>

            {/* Component Content */}
            <div className="rounded-lg">
              {activeComponent === 'dashboard' && <Dashboard colors={colors} />}
              {activeComponent === 'student' && <Addstd />}
              {activeComponent === 'hospital' && <Hospitals />}
              {activeComponent === 'payment' && <Payment />}
              {activeComponent === 'Updates' && <AddUpdates />}
              {activeComponent === 'status' && <StudentMedical />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;