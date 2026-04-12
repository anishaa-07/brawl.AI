import { io } from 'socket.io-client';

// 'autoConnect: false' prevents the socket from automatically opening immediately on app load. 
// We manually connect it when needed or simply rely on standard autoConnect flag.
// By default we use autoConnect true so that it hooks in on load for real-time lobbies.
const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false, // We'll manually connect in App.jsx
});

// Dev helper
socket.on('connect', () => {
  console.log('[Socket] Connected with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Socket] Disconnected from real-time core.');
});
