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
exports.BusController = void 0;
const common_1 = require("@nestjs/common");
const bus_service_1 = require("./bus.service");
const create_bus_dto_1 = require("./dto/create-bus.dto");
const update_bus_dto_1 = require("./dto/update-bus.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let BusController = class BusController {
    busService;
    constructor(busService) {
        this.busService = busService;
    }
    async create(createBusDto) {
        try {
            const newBus = await this.busService.createBus(createBusDto);
            return {
                message: 'Bus created successfully',
                data: newBus,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to create bus', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        return this.busService.findAll();
    }
    async findOne(id) {
        try {
            return await this.busService.findOne(+id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, updateBusDto) {
        try {
            const updatedBus = await this.busService.update(+id, updateBusDto);
            return {
                message: 'Bus updated successfully',
                data: updatedBus,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.busService.remove(+id);
            return { message: `Bus with ID ${id} deleted successfully` };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async assignDriver(busId, driverId) {
        try {
            const updatedBus = await this.busService.assignDriver(+busId, +driverId);
            return {
                message: 'Driver assigned successfully',
                data: updatedBus,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.BusController = BusController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bus_dto_1.CreateBusDto]),
    __metadata("design:returntype", Promise)
], BusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bus_dto_1.UpdateBusDto]),
    __metadata("design:returntype", Promise)
], BusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':busId/assign-driver/:driverId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('busId')),
    __param(1, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BusController.prototype, "assignDriver", null);
exports.BusController = BusController = __decorate([
    (0, common_1.Controller)('bus'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __metadata("design:paramtypes", [bus_service_1.BusService])
], BusController);
//# sourceMappingURL=bus.controller.js.map