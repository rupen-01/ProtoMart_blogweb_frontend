import React, { act, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminStats from '../components/admin/AdminStats';
import PendingPhotos from '../components/admin/PendingPhotos';
import WatermarkSettings from '../components/admin/WatermarkSettings';
import RewardSettings from '../components/admin/RewardSettings';
import AdminManagement from '../components/admin/AdminManagement';
import {
  LayoutDashboard,
  Image,
  Settings,
  Gift,
  ArrowLeft
} from 'lucide-react';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pending', label: 'Pending Photos', icon: Image },
    { id: 'watermark', label: 'Watermark', icon: Settings },
    { id: 'reward', label: 'Reward Settings', icon: Gift } ,
    { id: 'adminManagement', label: 'Admin Management', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                
              </button>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <AdminStats />}
        {activeTab === 'pending' && <PendingPhotos />}
        {activeTab === 'watermark' && <WatermarkSettings />}
        {activeTab === 'reward' && <RewardSettings />} {/* ✅ NEW */}
        {activeTab === 'adminManagement' && <AdminManagement />} {/* ✅ NEW */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
