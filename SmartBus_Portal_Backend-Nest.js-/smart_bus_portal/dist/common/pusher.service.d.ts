export declare class PusherService {
    private static instance;
    static getInstance(): PusherService;
    sendDriverUpdateNotification(driverId: number, data: any): Promise<void>;
    sendNameUpdateNotification(driverId: number, oldName: string, newName: string): Promise<void>;
    sendNidUpdateNotification(driverId: number, oldNid: string, newNid: string): Promise<void>;
}
