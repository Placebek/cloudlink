// Dashboard.jsx — полностью на русском, один файл, без импортов
import React from 'react';
import { 
  Cpu, Activity, AlertCircle, HardDrive, Thermometer, 
  Upload, Settings, RefreshCw, FileText, TrendingUp, Clock 
} from 'lucide-react';

// === Кнопка (не используется напрямую, но оставил на всякий случай) ===
function Button({ children, variant = 'primary', onClick }) {
  const base = 'px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105';
  const variants = {
    primary: 'bg-[#00f2ff] text-black shadow-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]',
    danger: 'bg-[#ff0055] text-white shadow-lg hover:shadow-[0_0_30px_rgba(255,0,85,0.6)]',
  };
  return <button onClick={onClick} className={`${base} ${variants[variant]}`}>{children}</button>;
}

// === Карточка метрики ===
function MetricCard({ icon, label, value, color }) {
  const colors = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    cyan: 'text-[#00f2ff]',
  };
  const bgGrad = {
    green: 'from-green-100 to-green-50',
    red: 'from-red-100 to-red-50',
    blue: 'from-blue-100 to-blue-50',
    purple: 'from-purple-100 to-purple-50',
    cyan: 'from-cyan-100 to-cyan-50',
  };

  return (
    <div className={`bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 transition-all hover:scale-105 hover:shadow-2xl`}>
      <div className={`p-3 bg-gradient-to-br ${bgGrad[color]} rounded-xl w-fit mb-4`}>
        {React.cloneElement(icon, { className: "w-10 h-10" })}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`text-3xl font-bold ${colors[color]} mt-1`}>{value}</div>
    </div>
  );
}

// === Кнопка быстрого действия ===
function QuickActionButton({ icon, label, color }) {
  const gradients = {
    cyan: 'from-[#00f2ff] to-cyan-400 hover:shadow-[0_0_40px_rgba(0,242,255,0.4)]',
    purple: 'from-[#9d00ff] to-purple-500 hover:shadow-[0_0_40px_rgba(157,0,255,0.4)]',
    blue: 'from-blue-500 to-blue-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]',
    green: 'from-green-500 to-green-600 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]',
  };
  return (
    <button className="group bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 transition-all hover:scale-105 hover:shadow-2xl text-center">
      <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { className: "w-12 h-12" })}
      </div>
      <div className="text-lg font-semibold text-gray-800">{label}</div>
    </button>
  );
}

// === Строка устройства ===
function DeviceRow({ name, machine, status, temp, storage, lastSeen }) {
  const statusCfg = {
    online: { dot: 'bg-green-500', text: 'text-green-600', card: 'bg-green-50' },
    offline: { dot: 'bg-gray-400', text: 'text-gray-600', card: 'bg-gray-50' },
    warning: { dot: 'bg-yellow-500', text: 'text-yellow-600', card: 'bg-yellow-50' },
  };
  const s = statusCfg[status];
  return (
    <div className={`flex items-center gap-6 p-5 rounded-2xl ${s.card} border border-white/40 hover:border-white/80 hover:scale-[1.02] transition-all`}>
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full ${s.dot} shadow-lg`} />
        <div className="p-3 bg-white/80 rounded-xl">
          <Cpu className={`w-6 h-6 ${s.text}`} />
        </div>
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">{machine}</div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2"><Thermometer className="w-5 h-5 text-orange-500" /> {temp}°C</div>
        <div className="flex items-center gap-2"><HardDrive className="w-5 h-5 text-blue-500" /> {storage}</div>
        <div className="flex items-center gap-2 text-gray-500"><Clock className="w-5 h-5" /> {lastSeen}</div>
      </div>
    </div>
  );
}

// === Событие в логе ===
function EventItem({ device, message, status, time }) {
  const cfg = {
    success: { dot: 'bg-green-500', bg: 'bg-green-50' },
    info: { dot: 'bg-blue-500', bg: 'bg-blue-50' },
    warning: { dot: 'bg-yellow-500', bg: 'bg-yellow-50' },
    error: { dot: 'bg-red-500', bg: 'bg-red-50' },
  };
  const s = cfg[status];
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${s.bg} border border-white/40 hover:border-white/60 transition-all`}>
      <div className={`w-3 h-3 rounded-full ${s.dot} shadow-lg`} />
      <div className="flex-1">
        <span className="font-medium text-gray-900">{device}</span>
        <span className="text-gray-500 mx-2">•</span>
        <span className="text-gray-700">{message}</span>
      </div>
      <div className="text-sm text-gray-500">{time}</div>
    </div>
  );
}

// === Главный дашборд ===
export default function Dashboard() {
  const recentEvents = [
    { device: 'rpi-001', message: 'УП v12 успешно загружена', status: 'success', time: '2 мин назад' },
    { device: 'rpi-003', message: 'Система перезагружена', status: 'info', time: '5 мин назад' },
    { device: 'Fanuc-04', message: 'Предупреждение связи', status: 'warning', time: '12 мин назад' },
    { device: 'rpi-007', message: 'Высокая температура (78°C)', status: 'warning', time: '18 мин назад' },
    { device: 'rpi-002', message: 'Передача файла завершена', status: 'success', time: '23 мин назад' },
    { device: 'Haas-01', message: 'Запущено выполнение программы', status: 'success', time: '31 мин назад' },
  ];

  const recentDevices = [
    { name: 'Raspberry Pi №001', machine: 'Fanuc 0i-MF', status: 'online', temp: 62, storage: '18.4 ГБ', lastSeen: 'Активно' },
    { name: 'Raspberry Pi №003', machine: 'Haas VF-2', status: 'online', temp: 58, storage: '22.1 ГБ', lastSeen: 'Активно' },
    { name: 'Raspberry Pi №007', machine: 'Mazak Nexus', status: 'warning', temp: 78, storage: '14.2 ГБ', lastSeen: '2 мин назад' },
    { name: 'Raspberry Pi №009', machine: 'DMG Mori NLX', status: 'offline', temp: 45, storage: '8.9 ГБ', lastSeen: '1 час назад' },
  ];

  return (
    <div className="min-h-screen ">
      {/* Шапка */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Фоновая сетка — оставляем, она круто смотрится */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-white/25 backdrop-blur-md rounded-3xl shadow-xl border border-white/20">
                <Cpu className="w-16 h-16" />
              </div>
              <div>
                <h1 className="text-5xl font-bold drop-shadow-lg">Панель управления</h1>
                <p className="text-xl text-blue-50 mt-2 font-medium drop-shadow">
                  Мониторинг всех Raspberry Pi и станков ЧПУ в реальном времени
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-blue-100 text-lg font-medium">Всего устройств</div>
              <div className="text-7xl font-extrabold bg-gradient-to-b from-white to-blue-200 bg-clip-text text-transparent">
                12
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">

        {/* Метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard icon={<Activity />} label="Онлайн" value="10" color="green" />
          <MetricCard icon={<AlertCircle />} label="Проблемы" value="2" color="red" />
          <MetricCard icon={<Thermometer />} label="Средняя температура" value="64°C" color="blue" />
          <MetricCard icon={<HardDrive />} label="Свободно на дисках" value="248 ГБ" color="purple" />
          <MetricCard icon={<TrendingUp />} label="Программ сегодня" value="34" color="cyan" />
        </div>

        {/* Последние события */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-600" /> Последние события
          </h2>
          <div className="space-y-3">
            {recentEvents.map((e, i) => <EventItem key={i} {...e} />)}
          </div>
        </div>

        {/* Быстрые действия */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Быстрые действия</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionButton icon={<Upload />} label="Загрузить УП на все" color="cyan" />
            <QuickActionButton icon={<RefreshCw />} label="Перезагрузить все Pi" color="purple" />
            <QuickActionButton icon={<Settings />} label="Настройки сети" color="blue" />
            <QuickActionButton icon={<FileText />} label="Просмотр логов" color="green" />
          </div>
        </div>

        {/* Активные устройства */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Cpu className="w-8 h-8 text-blue-600" /> Активные устройства
            </h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-lg">
              Все устройства →
            </button>
          </div>
          <div className="space-y-4">
            {recentDevices.map((d, i) => <DeviceRow key={i} {...d} />)}
          </div>
        </div>

      </div>
    </div>
  );
}