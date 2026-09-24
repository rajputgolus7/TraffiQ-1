import { io, Socket } from 'socket.io-client';

// Empty string forces socket.io to use the current host, which is then caught by Vite's proxy.
const WS_URL = import.meta.env.VITE_WS_URL || '';

class WebSocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  subscribeToDetections(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('detection', callback);
  }

  unsubscribeFromDetections() {
    if (!this.socket) return;
    this.socket.off('detection');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const wsService = new WebSocketService();
