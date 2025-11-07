import { Repository } from 'typeorm';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Bus } from './entities/bus.entity';
import { Driver } from '../driver/entities/driver.entity';
export declare class BusService {
    private readonly busRepository;
    private readonly driverRepository;
    constructor(busRepository: Repository<Bus>, driverRepository: Repository<Driver>);
    createBus(busData: CreateBusDto): Promise<Bus>;
    assignDriver(busId: number, driverId: number): Promise<Bus>;
    findAll(): Promise<Bus[]>;
    findOne(id: number): Promise<Bus>;
    update(id: number, updateBusDto: UpdateBusDto): Promise<Bus>;
    remove(id: number): Promise<void>;
}
