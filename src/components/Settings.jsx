// Settings.jsx — Светлая версия на русском языке
import React, { useState } from "react";
import { Check } from "lucide-react";

// === Кнопка ===
function Button({ children, variant = "primary", onClick }) {
    const baseClasses =
        "px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md";
    const variants = {
        primary:
            "bg-[#00f2ff] text-black hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] hover:scale-105",
        danger: "bg-[#ff3366] text-white hover:shadow-[0_0_30px_rgba(255,51,102,0.5)] hover:scale-105",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]}`}
        >
            {children}
        </button>
    );
}

// === Поле ввода ===
function TextInput({ label, value, onChange }) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00f2ff] focus:ring-4 focus:ring-[#00f2ff]/20 transition-all shadow-sm"
            />
        </div>
    );
}

// === Переключатель ===
function Toggle({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#00f2ff] transition-all">
            <span className="text-gray-800 font-medium">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                    checked ? "bg-[#00f2ff]" : "bg-gray-300"
                }`}
            >
                <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        checked ? "translate-x-6" : "translate-x-0"
                    }`}
                />
            </button>
        </div>
    );
}

// === Чекбокс ===
function Checkbox({ label, checked, onChange }) {
    return (
        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:border-[#00f2ff] transition-all">
            <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    checked
                        ? "bg-[#00f2ff] border-[#00f2ff]"
                        : "border-gray-400"
                }`}
            >
                {checked && (
                    <Check className="w-4 h-4 text-black" strokeWidth={3} />
                )}
            </div>
            <span className="text-gray-800 font-medium">{label}</span>
        </label>
    );
}

// === Основной компонент ===
export default function Settings() {
    const [ipAddress, setIpAddress] = useState("192.168.1.100");
    const [dncPort, setDncPort] = useState("23");
    const [useWifi, setUseWifi] = useState(true);
    const [requirePassword, setRequirePassword] = useState(false);
    const [enableTLS, setEnableTLS] = useState(false);
    const [scanFiles, setScanFiles] = useState(false);
    const [notifyUpload, setNotifyUpload] = useState(true);
    const [notifyCNCErrors, setNotifyCNCErrors] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    const handleSaveNetwork = () => {
        alert(
            `Настройки сети сохранены!\nIP: ${ipAddress}\nПорт: ${dncPort}\nWi-Fi: ${
                useWifi ? "включён" : "выключен"
            }`
        );
    };

    const handleRestart = () => {
        if (confirm("Перезагрузить Raspberry Pi?")) {
            alert("Перезагрузка сервера запущена...");
        }
    };

    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-5xl mx-auto">
                {/* Заголовок */}
                <h1 className="text-4xl font-bold text-center mb-12 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Настройки системы
                </h1>

                {/* Сетевые настройки */}
                <section className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#9d00ff] mb-6">
                        Сетевые настройки
                    </h2>
                    <div className="space-y-5">
                        <TextInput
                            label="IP-адрес Raspberry Pi"
                            value={ipAddress}
                            onChange={setIpAddress}
                        />
                        <TextInput
                            label="Порт DNC"
                            value={dncPort}
                            onChange={setDncPort}
                        />
                        <Toggle
                            label="Использовать Wi-Fi"
                            checked={useWifi}
                            onChange={setUseWifi}
                        />
                        <div className="pt-4">
                            <Button
                                variant="primary"
                                onClick={handleSaveNetwork}
                            >
                                Сохранить сеть
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Безопасность */}
                <section className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#9d00ff] mb-6">
                        Безопасность
                    </h2>
                    <div className="space-y-4">
                        <Toggle
                            label="Требовать пароль при загрузке УП"
                            checked={requirePassword}
                            onChange={setRequirePassword}
                        />
                        <Toggle
                            label="Включить шифрование TLS"
                            checked={enableTLS}
                            onChange={setEnableTLS}
                        />
                        <Toggle
                            label="Проверять файлы антивирусом"
                            checked={scanFiles}
                            onChange={setScanFiles}
                        />
                    </div>
                </section>

                {/* Уведомления */}
                <section className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#9d00ff] mb-6">
                        Уведомления
                    </h2>
                    <div className="space-y-4">
                        <Checkbox
                            label="Оповещать об успешной загрузке"
                            checked={notifyUpload}
                            onChange={setNotifyUpload}
                        />
                        <Checkbox
                            label="Оповещать об ошибках станков"
                            checked={notifyCNCErrors}
                            onChange={setNotifyCNCErrors}
                        />
                        <Checkbox
                            label="Push-уведомления в браузере"
                            checked={pushNotifications}
                            onChange={setPushNotifications}
                        />
                    </div>
                </section>

                {/* О системе */}
                <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#9d00ff] mb-6">
                        О системе
                    </h2>
                    <div className="space-y-4 text-gray-700">
                        <p>
                            Версия сервера:{" "}
                            <span className="font-bold text-[#00f2ff]">
                                v2.1.0
                            </span>
                        </p>
                        <p>
                            Подключено станков:{" "}
                            <span className="font-bold text-[#00f2ff]">12</span>
                        </p>
                        <div className="pt-6">
                            <Button 
                            onClick={handleRestart}
                            className="bg-[#9d00ff] text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-[0_0_40px_rgba(157,0,255,0.7)] hover:scale-105 shadow-lg"
                            >
                            Перезагрузить Raspberry Pi
                            </Button>
                        </div>
                        {/* <button className="mt-8 text-red-600 hover:text-red-800 font-medium transition-colors">
                            Выйти из аккаунта
                        </button> */}
                    </div>
                </section>
            </div>
        </div>
    );
}
