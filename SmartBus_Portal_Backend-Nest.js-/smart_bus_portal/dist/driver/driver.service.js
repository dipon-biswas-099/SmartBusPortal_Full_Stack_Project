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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const driver_entity_1 = require("./entities/driver.entity");
const bcrypt = require("bcrypt");
const bus_entity_1 = require("../bus/entities/bus.entity");
const pusher_service_1 = require("../common/pusher.service");
let DriverService = class DriverService {
    driverRepository;
    busRepository;
    jwtService;
    pusherService;
    constructor(driverRepository, busRepository, jwtService) {
        this.driverRepository = driverRepository;
        this.busRepository = busRepository;
        this.jwtService = jwtService;
        this.pusherService = pusher_service_1.PusherService.getInstance();
    }
    async create(createDriverDto) {
        try {
            const existingDriver = await this.driverRepository.findOne({
                where: { email: createDriverDto.email }
            });
            if (existingDriver) {
                throw new common_1.HttpException('Email already registered', common_1.HttpStatus.CONFLICT);
            }
            const bus = await this.busRepository.findOne({
                where: { id: createDriverDto.busId },
            });
            if (!bus) {
                throw new common_1.HttpException('Bus not found', common_1.HttpStatus.NOT_FOUND);
            }
            const driver = this.driverRepository.create(createDriverDto);
            await this.driverRepository.save({
                ...driver,
                bus: bus,
            });
            return {
                message: 'Driver created successfully',
                data: driver,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error.code === '23505') {
                throw new common_1.HttpException('Email already registered', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException('Failed to create driver', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            const drivers = await this.driverRepository.find({
                relations: ['bus'],
            });
            return drivers;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch drivers', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { id },
                relations: ['bus'],
            });
            if (!driver) {
                throw new common_1.HttpException('Driver not found', common_1.HttpStatus.NOT_FOUND);
            }
            return driver;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to fetch driver', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateDriverDto) {
        try {
            console.log('Service update - Driver ID:', id);
            console.log('Service update - DTO:', updateDriverDto);
            const existingDriver = await this.driverRepository.findOne({
                where: { id },
            });
            if (!existingDriver) {
                throw new common_1.HttpException('Driver not found', common_1.HttpStatus.NOT_FOUND);
            }
            const oldName = existingDriver.name;
            const oldNid = existingDriver.nid;
            if (updateDriverDto.email && updateDriverDto.email !== existingDriver.email) {
                const emailExists = await this.driverRepository.findOne({
                    where: { email: updateDriverDto.email }
                });
                if (emailExists && emailExists.id !== id) {
                    throw new common_1.HttpException('Email already registered', common_1.HttpStatus.CONFLICT);
                }
            }
            if (updateDriverDto.password) {
                updateDriverDto.password = await bcrypt.hash(updateDriverDto.password, 10);
            }
            await this.driverRepository.update(id, updateDriverDto);
            const updatedDriver = await this.driverRepository.findOne({
                where: { id },
                relations: ['bus'],
            });
            try {
                if (updateDriverDto.name && updateDriverDto.name !== oldName) {
                    await this.pusherService.sendNameUpdateNotification(id, oldName, updateDriverDto.name);
                }
                if (updateDriverDto.nid && updateDriverDto.nid !== oldNid) {
                    await this.pusherService.sendNidUpdateNotification(id, oldNid, updateDriverDto.nid);
                }
                await this.pusherService.sendDriverUpdateNotification(id, {
                    message: 'Your profile has been successfully updated!',
                    updatedData: updatedDriver,
                    updatedFields: Object.keys(updateDriverDto),
                });
            }
            catch (pusherError) {
                console.error('Pusher notification error:', pusherError);
            }
            return {
                message: 'Driver updated successfully',
                data: updatedDriver,
            };
        }
        catch (error) {
            console.error('Service update error:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error.code === '23505') {
                throw new common_1.HttpException('Email already registered', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException('Failed to update driver', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            const driver = await this.findOne(id);
            await this.driverRepository.remove(driver);
            return {
                message: 'Driver deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to delete driver', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validateDriver(email, password) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'name', 'nid', 'nidImage', 'isActive']
            });
            if (!driver || !driver.password) {
                throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
            }
            const isPasswordValid = await bcrypt.compare(password, driver.password);
            if (!isPasswordValid) {
                throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
            }
            const payload = {
                sub: driver.id,
                email: driver.email
            };
            const access_token = this.jwtService.sign(payload);
            return {
                access_token,
                driver: {
                    id: driver.id,
                    name: driver.name,
                    email: driver.email,
                    nid: driver.nid,
                    nidImage: driver.nidImage,
                    isActive: driver.isActive
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('Login error:', error);
            throw new common_1.HttpException('Authentication failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByEmail(email) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { email },
            });
            if (!driver) {
                throw new common_1.HttpException('Driver not found', common_1.HttpStatus.NOT_FOUND);
            }
            return driver;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch driver', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(1, (0, typeorm_1.InjectRepository)(bus_entity_1.Bus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], DriverService);
//# sourceMappingURL=driver.service.js.map