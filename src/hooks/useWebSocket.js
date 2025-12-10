// src/hooks/useWebSocket.js - WebSocket for real-time updates
import { useEffect } from 'react';

const useWebSocket = (setDevices) => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws'); // Replace with your WebSocket URL

    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDevices((prev) => {
        // Update devices list with new data (e.g., merge or replace)
        const updated = prev.map((d) => (d.id === data.id ? { ...d, ...data } : d));
        return updated;
      });
    };
    ws.onclose = () => console.log('WebSocket disconnected');

    return () => ws.close();
  }, [setDevices]);
};

export default useWebSocket;