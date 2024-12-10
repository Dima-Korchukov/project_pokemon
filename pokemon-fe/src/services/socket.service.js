import { io } from "socket.io-client";
import { socketBaseUrl } from "../utils/network";

class SocketService {
  constructor() {
    if (!SocketService.instance) {
      this.socket = null;
      SocketService.instance = this;
    }

    return SocketService.instance;
  }

  connect(sessionId) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(socketBaseUrl, {
      auth: { token: localStorage.getItem("token"), sessionId },
    });

    this.registerDefaultEvents();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  registerDefaultEvents() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to the game socket.");
    });

    this.socket.on("battleUpdate", (battleState) => {
      console.log("Battle state updated:", battleState);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from the game socket.");
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  emit(event, data) {
    if (!this.socket) {
      throw new Error("Socket connection not established.");
    }

    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) {
      throw new Error("Socket connection not established.");
    }

    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) {
      throw new Error("Socket connection not established.");
    }

    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }
}

const socketServiceInstance = new SocketService();
export const socketService = socketServiceInstance;
