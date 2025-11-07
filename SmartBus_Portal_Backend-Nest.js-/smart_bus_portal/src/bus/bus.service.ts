import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Bus } from './entities/bus.entity';
import { Driver } from '../driver/entities/driver.entity';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,

    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  // ✅ Create Bus with Driver
  async createBus(busData: CreateBusDto): Promise<Bus> {
    const driver = await this.driverRepository.findOne({
      where: { id: busData.driverId },
    });

    if (!driver) {
      throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
    }

    const bus = this.busRepository.create({
      ...busData,
      drivers: [driver], // since it's OneToMany
    });

    return await this.busRepository.save(bus);
  }

  // ✅ Assign Driver to an existing Bus
  async assignDriver(busId: number, driverId: number): Promise<Bus> {
    const bus = await this.busRepository.findOne({
      where: { id: busId },
      relations: ['drivers'],
    });
    if (!bus) {
      throw new HttpException('Bus not found', HttpStatus.NOT_FOUND);
    }

    const driver = await this.driverRepository.findOne({ where: { id: driverId } });
    if (!driver) {
      throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
    }

    bus.drivers.push(driver);
    return await this.busRepository.save(bus);
  }

  // ✅ Get All Buses
  async findAll(): Promise<Bus[]> {
    return await this.busRepository.find({ relations: ['drivers'] });
  }

  // ✅ Get One Bus by ID
  async findOne(id: number): Promise<Bus> {
    const bus = await this.busRepository.findOne({
      where: { id },
      relations: ['drivers'],
    });
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    return bus;
  }

  // ✅ Update Bus
  async update(id: number, updateBusDto: UpdateBusDto): Promise<Bus> {
    const bus = await this.busRepository.findOne({ where: { id } });
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }

    Object.assign(bus, updateBusDto);
    return await this.busRepository.save(bus);
  }

  // ✅ Remove Bus
  async remove(id: number): Promise<void> {
    const result = await this.busRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
  }
}
