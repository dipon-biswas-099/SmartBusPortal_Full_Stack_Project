"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PusherService = void 0;
class PusherService {
    static instance;
    static getInstance() {
        if (!PusherService.instance) {
            PusherService.instance = new PusherService();
        }
        return PusherService.instance;
    }
    async sendDriverUpdateNotification(driverId, data) {
        console.log(`[MOCK PUSHER] Sending notification to driver-${driverId}:`, data);
    }
    async sendNameUpdateNotification(driverId, oldName, newName) {
        console.log(`[MOCK PUSHER] Name update for driver-${driverId}: ${oldName} -> ${newName}`);
    }
    async sendNidUpdateNotification(driverId, oldNid, newNid) {
        console.log(`[MOCK PUSHER] NID update for driver-${driverId}: ${oldNid} -> ${newNid}`);
    }
}
exports.PusherService = PusherService;
//# sourceMappingURL=pusher.service.js.map