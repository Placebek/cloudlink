// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Home, Cpu, FolderOpen, FileText, Settings, LogOut, Activity } from 'lucide-react';
import RaspberryList from './components/RaspberryList';
import RaspberryDetail from './components/RaspberryDetail';
import Dashboard from './components/Dashboard';
import Groups from './components/Groups';
import Logs from './components/Logs';
import SettingsPage from './components/Settings';
import Login from './components/Login';
import useAuth from './hooks/useAuth';
import useWebSocket from './hooks/useWebSocket';

// Анимированный индикатор активного пункта меню
function NavItem({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
        ${isActive 
          ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-white hover:shadow-md hover:text-blue-600'
        }`}
    >
      {isActive && (
        <span className="absolute inset-0 bg-white opacity-10"></span>
      )}
      <Icon size={20} className="relative z-10" />
      <span className="font-medium relative z-10">{children}</span>
      
      {/* Плавная подсветка при наведении */}
      <span className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></span>
    </Link>
  );
}

function App() {
  const { isAuthenticated, logout } = useAuth();
  const [devices, setDevices] = useState([]);
  useWebSocket(setDevices);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Sidebar с glassmorphism */}
        <nav className="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 p-6 flex flex-col">
          {/* Логотип */}
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Cpu size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PiControl
                </h1>
                <p className="text-xs text-gray-500">Управление флотом</p>
              </div>
            </div>
          </div>

          {/* Навигация */}
          <div className="flex-1 space-y-2">
            <NavItem to="/dashboard" icon={Activity}>Dashboard</NavItem>
            <NavItem to="/raspberries" icon={Cpu}>Устройства</NavItem>
            <NavItem to="/groups" icon={FolderOpen}>Архив</NavItem>
            <NavItem to="/logs" icon={FileText}>Логи</NavItem>
            <NavItem to="/settings" icon={Settings}>Настройки</NavItem>
          </div>

          {/* Выход */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 group"
          >
            <LogOut size={20} />
            <span className="font-medium">Выйти</span>
          </button>
        </nav>

        {/* Основной контент */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard devices={devices} />} />
              <Route path="/raspberries" element={<RaspberryList devices={devices} setDevices={setDevices} />} />
              <Route path="/raspberries/:id" element={<RaspberryDetail devices={devices} />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;