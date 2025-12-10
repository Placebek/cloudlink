// src/components/RaspberryList.jsx
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useNavigate } from 'react-router-dom';
import { Cpu, Activity, AlertCircle } from 'lucide-react';

// Моковые данные (можно удалить, когда подключится настоящий API)
const mockDevices = [
  {
    id: 'rpi-001',
    hostname: 'kitchen-pi',
    serial: '10000000a1b2c3d4',
    ip: '192.168.1.45',
    online: true,
    temperature: 48,
    software_version: 'v2.4.1',
    free_space: 12.8,
    last_seen: 'только что',
    status: 'OK',
  },
  {
    id: 'rpi-002',
    hostname: 'garage-sensor',
    ip: '192.168.1.78',
    online: false,
    temperature: 62,
    software_version: 'v2.4.1',
    free_space: 3.2,
    last_seen: '2 мин назад',
    status: 'Warning',
  },
  {
    id: 'rpi-003',
    hostname: 'bedroom-cam',
    ip: '192.168.1.112',
    online: false,
    temperature: null,
    software_version: 'v2.3.9',
    free_space: null,
    last_seen: '1 час назад',
    status: 'Error',
  },
  {
    id: 'rpi-004',
    hostname: 'livingroom-hub',
    ip: '192.168.1.33',
    online: false,
    temperature: 41,
    software_version: 'v2.4.1',
    free_space: 18.5,
    last_seen: 'только что',
    status: 'OK',
  },
  {
    id: 'rpi-005',
    hostname: 'attic-monitor',
    ip: '192.168.1.99',
    online: false,
    temperature: 55,
    software_version: 'v2.4.0',
    free_space: 7.1,
    last_seen: '5 мин назад',
    status: 'Warning',
  },
  {
    id: 'rpi-006',
    hostname: 'garden-weather',
    ip: '192.168.1.201',
    online: false,
    temperature: 38,
    software_version: 'v2.4.1',
    free_space: 22.4,
    last_seen: '30 сек назад',
    status: 'OK',
  },
];

export default function RaspberryList({ devices: realDevices = [] }) {
  const navigate = useNavigate();
  const parentRef = useRef(null);

  // Используем моковые данные, если реальных нет
  const devices = realDevices.length > 0 ? realDevices : mockDevices;

  const rowVirtualizer = useVirtualizer({
    count: devices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // чуть выше для красоты
    overscan: 10,
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OK': return <Activity className="w-4 h-4 text-green-600" />;
      case 'Warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/20 overflow-hidden">
      {/* Заголовок */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Cpu className="w-8 h-8" />
          Устройства в сети
          <span className="ml-2 text-blue-100">({devices.length})</span>
        </h2>
        <p className="text-blue-100 mt-1">Мониторинг и управление Raspberry Pi</p>
      </div>

      {/* Шапка таблицы */}
      <div className="grid grid-cols-12 gap-4 bg-gray-50/80 px-6 py-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
        <div className="col-span-3">Устройство</div>
        <div className="col-span-1">IP</div>
        <div className="col-span-1 text-center">Онлайн</div>
        <div className="col-span-1 text-center">Темп.</div>
        <div className="col-span-1">Версия</div>
        <div className="col-span-1">Диск</div>
        <div className="col-span-2">Активность</div>
        <div className="col-span-1">Состояние</div>
        <div className="col-span-1 text-right">Действия</div>
      </div>

      {/* Виртуальный список */}
      <div ref={parentRef} className="h-[680px] overflow-auto">
        <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const d = devices[virtualRow.index];
            const isOnline = d.online !== false;

            return (
              <div
                key={virtualRow.key}
                className="absolute left-0 top-0 w-full px-6 transition-all hover:bg-linear-to-r hover:from-blue-50/50 hover:to-purple-50/30 border-b border-gray-100"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  height: `${virtualRow.size}px`,
                }}
              >
                <div className="grid grid-cols-12 gap-4 py-4 items-center">
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Cpu className={`w-5 h-5 ${isOnline ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{d.hostname}</div>
                        <div className="text-xs text-gray-500">{d.serial || '—'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 text-sm font-mono text-gray-600">{d.ip}</div>

                  <div className="col-span-1 text-center">
                    <div className={`w-3 h-3 rounded-full mx-auto ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                  </div>

                  <div className="col-span-1 text-center">
                    {d.temperature ? (
                      <span className={`font-medium ${d.temperature > 60 ? 'text-red-600' : 'text-gray-700'}`}>
                        {d.temperature}°C
                      </span>
                    ) : '—'}
                  </div>

                  <div className="col-span-1 text-sm">{d.software_version}</div>

                  <div className="col-span-1 text-sm">
                    {d.free_space ? `${d.free_space} GB` : '—'}
                  </div>

                  <div className="col-span-2 text-xs text-gray-500">
                    {d.last_seen || d.last_ping}
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(d.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${d.status === 'OK' ? 'bg-green-100 text-green-800' :
                          d.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}
                      >
                        {d.status || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => navigate(`/raspberries/${d.id}`)}
                      className="px-5 cursor-pointer py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                    >
                      Открыть
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}