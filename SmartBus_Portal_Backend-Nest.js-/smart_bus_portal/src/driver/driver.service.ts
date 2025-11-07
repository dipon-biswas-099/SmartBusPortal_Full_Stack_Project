import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';
import * as bcrypt from 'bcrypt';
import { Bus } from 'src/bus/entities/bus.entity';
import { PusherService } from '../common/pusher.service';

@Injectable()
export class DriverService {
    private pusherService: PusherService;

    constructor(
        @InjectRepository(Driver) private driverRepository: Repository<Driver>,
        @InjectRepository(Bus) private busRepository: Repository<Bus>,
        private jwtService: JwtService,
    ) {
        this.pusherService = PusherService.getInstance();
    }

    async create(createDriverDto: CreateDriverDto) {
        try {
           // console.log('createDriverDto #', createDriverDto);
            // Check if email already exists
            const existingDriver = await this.driverRepository.findOne({
                where: { email: createDriverDto.email }
            });

            if (existingDriver) {
                throw new HttpException(
                    'Email already registered',
                    HttpStatus.CONFLICT
                );
            }
            
            const bus = await this.busRepository.findOne({
                where: { id: createDriverDto.busId },
                    });
            if (!bus) {
                throw new HttpException('Bus not found', HttpStatus.NOT_FOUND);
            }
            // bus availablity check logic
            const driver = this.driverRepository.create(createDriverDto);
            await this.driverRepository.save({
                ...driver,
                bus: bus,
            });
            return {
                message: 'Driver created successfully',
                data: driver,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new HttpException(
                    'Email already registered',
                    HttpStatus.CONFLICT
                );
            }
            throw new HttpException(
                'Failed to create driver',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAll() {
        try {
            const drivers = await this.driverRepository.find({
                relations: ['bus'],
            });
            return drivers;
        } catch (error) {
            throw new HttpException('Failed to fetch drivers', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { id },
                relations: ['bus'], // Changed from 'buses' to 'bus'
            });
            if (!driver) {
                throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
            }
            return driver;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to fetch driver', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: number, updateDriverDto: UpdateDriverDto) {
        try {
            console.log('Service update - Driver ID:', id);
            console.log('Service update - DTO:', updateDriverDto);
            
            // Find the driver first
            const existingDriver = await this.driverRepository.findOne({
                where: { id },
            });
            
            if (!existingDriver) {
                throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
            }

            // Store old values for notifications
            const oldName = existingDriver.name;
            const oldNid = existingDriver.nid;

            // Check if email is being updated and if it's already taken by another driver
            if (updateDriverDto.email && updateDriverDto.email !== existingDriver.email) {
                const emailExists = await this.driverRepository.findOne({
                    where: { email: updateDriverDto.email }
                });
                
                if (emailExists && emailExists.id !== id) {
                    throw new HttpException('Email already registered', HttpStatus.CONFLICT);
                }
            }

            // Hash password if provided
            if (updateDriverDto.password) {
                updateDriverDto.password = await bcrypt.hash(updateDriverDto.password, 10);
            }

            // Update the driver
            await this.driverRepository.update(id, updateDriverDto);
            
            // Return the updated driver
            const updatedDriver = await this.driverRepository.findOne({
                where: { id },
                relations: ['bus'],
            });

            // Send Pusher notifications for specific field updates
            try {
                if (updateDriverDto.name && updateDriverDto.name !== oldName) {
                    await this.pusherService.sendNameUpdateNotification(
                        id, 
                        oldName, 
                        updateDriverDto.name
                    );
                }

                if (updateDriverDto.nid && updateDriverDto.nid !== oldNid) {
                    await this.pusherService.sendNidUpdateNotification(
                        id, 
                        oldNid, 
                        updateDriverDto.nid
                    );
                }

                // Send general update notification
                await this.pusherService.sendDriverUpdateNotification(id, {
                    message: 'Your profile has been successfully updated!',
                    updatedData: updatedDriver,
                    updatedFields: Object.keys(updateDriverDto),
                });
            } catch (pusherError) {
                console.error('Pusher notification error:', pusherError);
                // Don't fail the update if notifications fail
            }

            return {
                message: 'Driver updated successfully',
                data: updatedDriver,
            };
        } catch (error) {
            console.error('Service update error:', error);
            
            if (error instanceof HttpException) {
                throw error;
            }
            
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new HttpException(
                    'Email already registered',
                    HttpStatus.CONFLICT
                );
            }
            
            throw new HttpException('Failed to update driver', HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: number) {
        try {
            const driver = await this.findOne(id);
            await this.driverRepository.remove(driver);
            return {
                message: 'Driver deleted successfully',
            };
        } catch (error) {
            throw new HttpException('Failed to delete driver', HttpStatus.BAD_REQUEST);
        }
    }

    async validateDriver(email: string, password: string) {
        try {
            // Find the driver by email
            const driver = await this.driverRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'name', 'nid', 'nidImage', 'isActive'] // Include password for validation
            });

            // Check if driver exists
            if (!driver || !driver.password) {
                throw new HttpException(
                    'Invalid email or password',
                    HttpStatus.UNAUTHORIZED
                );
            }

            // Validate password
            const isPasswordValid = await bcrypt.compare(password, driver.password);
            if (!isPasswordValid) {
                throw new HttpException(
                    'Invalid email or password',
                    HttpStatus.UNAUTHORIZED
                );
            }

            // Generate JWT token
            const payload = { 
                sub: driver.id, 
                email: driver.email 
            };

            const access_token = this.jwtService.sign(payload);

            // Return success response with driver object for frontend compatibility
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
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.error('Login error:', error);
            throw new HttpException(
                'Authentication failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
/*
async assignBuses(driverId: number, busIds: number[]) {
  const driver = await this.findOne(driverId);

  const buses = await this.driverRepository.manager.findByIds(Bus, busIds);
  driver.buses = buses;

  await this.driverRepository.save(driver);

  // Reload with relations
  const updatedDriver = await this.driverRepository.findOne({
    where: { id: driverId },
    relations: ['buses'],
  });

  return {
    message: 'Buses assigned successfully',
    data: updatedDriver,
  };
}*/

/*
    async assignBus(id: number, updateDriverDto: UpdateDriverDto) {
  try {
    const driver = await this.findOne(id);

    if (updateDriverDto.password) {
      updateDriverDto.password = await bcrypt.hash(updateDriverDto.password, 10);
    }

    // If busIds are provided, fetch buses and assign
    if (updateDriverDto.busIds && updateDriverDto.busIds.length > 0) {
      const buses = await this.driverRepository.manager.findByIds(
        Bus,
        updateDriverDto.busIds
      );
      driver.buses = buses;
    }

    Object.assign(driver, updateDriverDto);
    await this.driverRepository.save(driver);

    return {
      message: 'Driver updated successfully',
      data: await this.findOne(id),
    };
  } catch (error) {
    throw new HttpException('Failed to update driver', HttpStatus.BAD_REQUEST);
  }
}*/

    async findByEmail(email: string) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { email },
            });
            if (!driver) {
                throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
            }
            return driver;
        } catch (error) {
            throw new HttpException('Failed to fetch driver', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
