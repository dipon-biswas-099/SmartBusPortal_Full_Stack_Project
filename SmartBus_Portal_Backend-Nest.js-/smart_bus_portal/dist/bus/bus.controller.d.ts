import { BusService } from './bus.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
export declare class BusController {
    private readonly busService;
    constructor(busService: BusService);
    create(createBusDto: CreateBusDto): Promise<{
        message: string;
        data: import("./entities/bus.entity").Bus;
    }>;
    findAll(): Promise<import("./entities/bus.entity").Bus[]>;
    findOne(id: string): Promise<import("./entities/bus.entity").Bus>;
    update(id: string, updateBusDto: UpdateBusDto): Promise<{
        message: string;
        data: import("./entities/bus.entity").Bus;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignDriver(busId: string, driverId: string): Promise<{
        message: string;
        data: import("./entities/bus.entity").Bus;
    }>;
}
