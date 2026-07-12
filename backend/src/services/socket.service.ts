import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { config } from "../config/env";
import { EmergencyAlert, BroadcastAlertPayload } from "../types";

export class SocketService {
  private io: SocketIOServer | null = null;
  private activeAlerts: EmergencyAlert[] = [
    {
      id: "1",
      district: "meerut",
      type: "weather",
      severity: "high",
      title: "Monsoon Heavy Rainfall Alert",
      description: "Heavy rainfall expected in 2 days. Prepare for potential waterlogging in low-lying areas.",
      timestamp: new Date().toISOString(),
      actionRequired: "Ensure field drainage channels are cleared.",
    },
    {
      id: "2",
      district: "meerut",
      type: "pest",
      severity: "medium",
      title: "Armyworm Outbreak Warning",
      description: "Armyworm activity reported in your district. Begin preventive neem oil spraying.",
      timestamp: new Date().toISOString(),
      actionRequired: "Inspect crops in evening hours.",
    }
  ];

  init(httpServer: HTTPServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*", // allow frontend access
        methods: ["GET", "POST"]
      }
    });

    this.setupListeners();
    console.log("⚡ Socket.IO Server initialized for real-time district alert multicasting.");
    return this.io;
  }

  getIO(): SocketIOServer {
    if (!this.io) {
      throw new Error("Socket.IO not initialized. Call init(httpServer) first.");
    }
    return this.io;
  }

  private setupListeners(): void {
    if (!this.io) return;

    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

      // Handle joining district room
      socket.on("join_district", (district: string) => {
        const roomName = `district_${(district || "general").toLowerCase().trim()}`;
        socket.join(roomName);
        console.log(`📍 Socket ${socket.id} joined district room: ${roomName}`);
        
        // Send existing active alerts for this district immediately
        const districtAlerts = this.getAlertsForDistrict(district);
        socket.emit("district_alerts_sync", districtAlerts);
      });

      // Handle leaving district room
      socket.on("leave_district", (district: string) => {
        const roomName = `district_${(district || "general").toLowerCase().trim()}`;
        socket.leave(roomName);
        console.log(`🚪 Socket ${socket.id} left room: ${roomName}`);
      });

      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });
  }

  broadcastAlert(payload: BroadcastAlertPayload): EmergencyAlert {
    const newAlert: EmergencyAlert = {
      id: Date.now(),
      district: payload.district.toLowerCase().trim(),
      type: payload.type,
      severity: payload.severity,
      title: payload.title,
      description: payload.description,
      actionRequired: payload.actionRequired,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Store in active alerts history
    this.activeAlerts.unshift(newAlert);
    if (this.activeAlerts.length > 50) this.activeAlerts.pop();

    if (this.io) {
      const roomName = `district_${newAlert.district}`;
      // Broadcast to specific district room AND all connected clients
      this.io.to(roomName).to("district_all").emit("emergency_alert", newAlert);
      this.io.emit("new_alert_broadcast", newAlert);
      console.log(`📢 Broadcasted emergency alert to room [${roomName}]: "${newAlert.title}"`);
    }

    return newAlert;
  }

  getAlertsForDistrict(district?: string): EmergencyAlert[] {
    if (!district || district === "all" || district === "general") {
      return this.activeAlerts;
    }
    const cleanDist = district.toLowerCase().trim();
    return this.activeAlerts.filter(
      (a) => a.district === cleanDist || a.district === "all"
    );
  }
}

export const socketService = new SocketService();
