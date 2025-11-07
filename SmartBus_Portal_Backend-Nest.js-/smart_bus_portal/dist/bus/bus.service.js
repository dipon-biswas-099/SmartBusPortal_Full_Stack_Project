"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bus_entity_1 = require("./entities/bus.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
let BusService = class BusService {
    busRepository;
    driverRepository;
    constructor(busRepository, driverRepository) {
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
    }
    async createBus(busData) {
        const driver = await this.driverRepository.findOne({
            where: { id: busData.driverId },
        });
        if (!driver) {
            throw new common_1.HttpException('Driver not found', common_1.HttpStatus.NOT_FOUND);
        }
        const bus = this.busRepository.create({
            ...busData,
            drivers: [driver],
        });
        return await this.busRepository.save(bus);
    }
    async assignDriver(busId, driverId) {
        const bus = await this.busRepository.findOne({
            where: { id: busId },
            relations: ['drivers'],
        });
        if (!bus) {
            throw new common_1.HttpException('Bus not found', common_1.HttpStatus.NOT_FOUND);
        }
        const driver = await this.driverRepository.findOne({ where: { id: driverId } });
        if (!driver) {
            throw new common_1.HttpException('Driver not found', common_1.HttpStatus.NOT_FOUND);
        }
        bus.drivers.push(driver);
        return await this.busRepository.save(bus);
    }
    async findAll() {
        return await this.busRepository.find({ relations: ['drivers'] });
    }
    async findOne(id) {
        const bus = await this.busRepository.findOne({
            where: { id },
            relations: ['drivers'],
        });
        if (!bus) {
            throw new common_1.NotFoundException(`Bus with ID ${id} not found`);
        }
        return bus;
    }
    async update(id, updateBusDto) {
        const bus = await this.busRepository.findOne({ where: { id } });
        if (!bus) {
            throw new common_1.NotFoundException(`Bus with ID ${id} not found`);
        }
        Object.assign(bus, updateBusDto);
        return await this.busRepository.save(bus);
    }
    async remove(id) {
        const result = await this.busRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Bus with ID ${id} not found`);
        }
    }
};
exports.BusService = BusService;
exports.BusService = BusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bus_entity_1.Bus)),
    __param(1, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BusService);
//# sourceMappingURL=bus.service.js.map