import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

class SocketManager {
  private socket: Socket | null = null;
  private currentDistrict: string = 'meerut';

  getSocket(): Socket {
    if (!this.socket) {
      this.socket = io(BACKEND_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('⚡ Connected to Kisaan Sahayak Real-Time Socket.IO Server');
        this.joinDistrict(this.currentDistrict);
      });

      this.socket.on('disconnect', () => {
        console.warn('⚠️ Disconnected from Socket.IO Server');
      });
    }

    return this.socket;
  }

  joinDistrict(district: string) {
    this.currentDistrict = district.toLowerCase().trim();
    const socket = this.getSocket();
    if (socket.connected) {
      socket.emit('join_district', this.currentDistrict);
      console.log(`📍 Joined Socket.IO district room: ${this.currentDistrict}`);
    }
  }

  leaveDistrict(district: string) {
    const socket = this.getSocket();
    if (socket.connected) {
      socket.emit('leave_district', district.toLowerCase().trim());
    }
  }
}

export const socketManager = new SocketManager();
