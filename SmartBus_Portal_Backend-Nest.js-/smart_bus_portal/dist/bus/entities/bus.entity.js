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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bus = void 0;
const typeorm_1 = require("typeorm");
const driver_entity_1 = require("../../driver/entities/driver.entity");
let Bus = class Bus {
    id;
    busNumber;
    route;
    capacity;
    drivers;
    createdAt;
    updatedAt;
};
exports.Bus = Bus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Bus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bus.prototype, "busNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bus.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Bus.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => driver_entity_1.Driver, driver => driver.bus, { nullable: true }),
    __metadata("design:type", Array)
], Bus.prototype, "drivers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Bus.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Bus.prototype, "updatedAt", void 0);
exports.Bus = Bus = __decorate([
    (0, typeorm_1.Entity)()
], Bus);
//# sourceMappingURL=bus.entity.js.map