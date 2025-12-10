// Groups.jsx — полностью автономный, на русском, без импортов
import React, { useState } from 'react';
import { 
  FolderOpen, CheckCircle, AlertCircle, XCircle, Upload, History, Settings, 
  Cpu, FileCode2, RotateCcw, Plus, Search, X, Activity 
} from 'lucide-react';

// === Кнопка ===
function Button({ children, variant = 'primary', onClick }) {
  const base = 'px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg';
  const styles = {
    primary: 'bg-[#00f2ff] text-black hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]',
    danger: 'bg-[#ff0055] text-white hover:shadow-[0_0_30px_rgba(255,0,85,0.6)]',
    purple: 'bg-[#9d00ff] text-white hover:shadow-[0_0_40px_rgba(157,0,255,0.6)]',
  };
  return <button onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</button>;
}

// === Карточка группы ===
function GroupCard({ group, isSelected, onSelect }) {
  const statusCfg = {
    success: { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600 bg-green-50' },
    warning: { icon: <AlertCircle className="w-5 h-5" />, color: 'text-yellow-600 bg-yellow-50' },
    error: { icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600 bg-red-50' },
  };
  const s = statusCfg[group.status];

  return (
    <div
      onClick={() => onSelect(group)}
      className={`bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border transition-all duration-300 cursor-pointer p-8
        ${isSelected ? 'border-[#00f2ff] shadow-[0_0_40px_rgba(0,242,255,0.3)] scale-105' : 'border-white/20 hover:border-purple-300 hover:scale-105 hover:shadow-2xl'}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl">
            <FolderOpen className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
            <p className="text-sm text-gray-600">{group.machineCount} станков</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Текущая УП:</span>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${s.color}`}>
            {s.icon}
            <span className="font-medium">{group.version}</span>
          </div>
        </div>
        <div className="font-mono text-gray-900">{group.currentProgram}</div>
        <div className="text-sm text-gray-500 mt-2">
          {group.lastUpload} • {group.uploadedBy}
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="primary" onClick={(e) => { e.stopPropagation(); alert('Загрузка новой УП...'); }}>
          <Upload className="w-5 h-5 mr-2" /> Загрузить новую УП
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <button className="px-4 py-3 bg-white/80 rounded-xl border border-white/40 hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-2 text-gray-700">
            <History className="w-4 h-4" /> История
          </button>
          <button className="px-4 py-3 bg-white/80 rounded-xl border border-white/40 hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-2 text-gray-700">
            <Settings className="w-4 h-4" /> Настройки
          </button>
        </div>
      </div>
    </div>
  );
}

// === Боковая панель группы ===
function GroupSidebar({ group, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white/90 backdrop-blur-2xl shadow-2xl z-50 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl">
                <FolderOpen className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
                <p className="text-gray-600">{group.machineCount} станков в группе</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-xl">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Станки */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Станки в группе</h3>
              <div className="space-y-3">
                {group.machines.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <Cpu className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">{m.name}</div>
                      <div className="text-sm text-gray-600">{m.id}</div>
                    </div>
                    <div className="ml-auto w-3 h-3 bg-green-500 rounded-full shadow-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* История загрузок */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">История загрузок</h3>
              <div className="space-y-4">
                {group.history.map((h, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${h.status === 'success' ? 'bg-green-50 border-green-200' : h.status === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      {h.status === 'success' ? <CheckCircle className="w-6 h-6 text-green-600" /> : 
                       h.status === 'warning' ? <AlertCircle className="w-6 h-6 text-yellow-600" /> : 
                       <XCircle className="w-6 h-6 text-red-600" />}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{h.program} <span className="text-sm bg-white/70 px-2 py-1 rounded">{h.version}</span></div>
                        <div className="text-sm text-gray-600">{h.time} • {h.uploadedBy}</div>
                      </div>
                    </div>
                    {i > 0 && (
                      <button className="mt-3 w-full py-2 bg-white/70 hover:bg-white rounded-lg text-sm flex items-center justify-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Откатить до этой версии
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="primary" className="w-full text-lg py-4">
                <Upload className="w-6 h-6 mr-2" /> Загрузить новую программу
              </Button>
              <Button variant="purple" className="w-full text-lg py-4">
                <Settings className="w-6 h-6 mr-2" /> Настройки группы
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// === Главная страница Groups ===
export default function Groups() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const groups = [
    { id: 1, name: 'Фрезерный участок А', machineCount: 8, currentProgram: 'Part_127-v34.nc', version: 'v34', lastUpload: '2 мин назад', uploadedBy: 'rpi-001', status: 'success', machines: [{ id: '192.168.1.45', name: 'Fanuc 0i-MF' }, { id: '192.168.1.78', name: 'Haas VF-2' }], history: [
      { version: 'v34', program: 'Part_127-v34.nc', time: '2 мин назад', uploadedBy: 'rpi-001', status: 'success' },
      { version: 'v33', program: 'Part_127-v33.nc', time: '1 час назад', uploadedBy: 'rpi-003', status: 'success' },
      { version: 'v32', program: 'Part_127-v32.nc', time: 'вчера', uploadedBy: 'rpi-007', status: 'warning' },
    ]},
    { id: 2, name: 'Токарный цех', machineCount: 6, currentProgram: 'Shaft_89-v12.nc', version: 'v12', lastUpload: '15 мин назад', uploadedBy: 'rpi-002', status: 'success', machines: [], history: [] },
    { id: 3, name: 'Ночная смена', machineCount: 10, currentProgram: 'Housing-v56.nc', version: 'v56', lastUpload: '5 часов назад', uploadedBy: 'rpi-009', status: 'warning', machines: [], history: [] },
    { id: 4, name: 'Сборочный участок', machineCount: 4, currentProgram: 'Bracket-v8.nc', version: 'v8', lastUpload: 'сегодня в 08:12', uploadedBy: 'rpi-004', status: 'success', machines: [], history: [] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fc] via-[#f1f5f9] to-[#e8f0fe]">
      {/* Шапка */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-[2.5rem] overflow-hidden shadow-2xl mx-8 mt-8">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 py-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white/25 backdrop-blur-md rounded-3xl border border-white/20">
              <FolderOpen className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-5xl font-bold drop-shadow-lg">Группы станков</h1>
              <p className="text-xl text-blue-50 mt-2 font-medium drop-shadow">Загрузка УП сразу на несколько станков</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-100 text-lg">Всего групп</div>
            <div className="text-7xl font-extrabold bg-gradient-to-b from-white to-blue-200 bg-clip-text text-transparent">{groups.length}</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Поиск */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Поиск групп..." className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 focus:border-[#00f2ff] focus:outline-none transition-all" />
          </div>
          <Button 
          variant="primary" 
          onClick={() => alert('Создать группу')}
          className="flex items-center gap-3 font-semibold text-lg shadow-xl hover:shadow-[0_0_40px_rgba(0,242,255,0.5)]"
        >
          <span>Создать группу</span>
        </Button>
        </div>

        {/* Сетка групп */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map(g => (
            <GroupCard key={g.id} group={g} isSelected={selectedGroup?.id === g.id} onSelect={setSelectedGroup} />
          ))}
        </div>
      </div>

      {/* Боковая панель */}
      {selectedGroup && <GroupSidebar group={selectedGroup} onClose={() => setSelectedGroup(null)} />}
    </div>
  );
}