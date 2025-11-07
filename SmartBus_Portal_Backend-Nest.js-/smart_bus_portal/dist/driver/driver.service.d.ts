import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';
import { Bus } from 'src/bus/entities/bus.entity';
export declare class DriverService {
    private driverRepository;
    private busRepository;
    private jwtService;
    private pusherService;
    constructor(driverRepository: Repository<Driver>, busRepository: Repository<Bus>, jwtService: JwtService);
    create(createDriverDto: CreateDriverDto): Promise<{
        message: string;
        data: Driver;
    }>;
    findAll(): Promise<Driver[]>;
    findOne(id: number): Promise<Driver>;
    update(id: number, updateDriverDto: UpdateDriverDto): Promise<{
        message: string;
        data: Driver | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    validateDriver(email: string, password: string): Promise<{
        access_token: string;
        driver: {
            id: number;
            name: string;
            email: string;
            nid: string;
            nidImage: string;
            isActive: boolean;
        };
    }>;
    findByEmail(email: string): Promise<Driver>;
}
