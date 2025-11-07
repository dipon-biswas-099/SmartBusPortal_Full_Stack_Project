import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { BusService } from './bus.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('bus')
@UsePipes(new ValidationPipe())
export class BusController {
  constructor(private readonly busService: BusService) {}

  // ✅ Create Bus
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBusDto: CreateBusDto) {
    try {
      const newBus = await this.busService.createBus(createBusDto);
      return {
        message: 'Bus created successfully',
        data: newBus,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create bus',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ✅ Get All Buses
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.busService.findAll();
  }

  // ✅ Get One Bus by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    try {
      return await this.busService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // ✅ Update Bus
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto) {
    try {
      const updatedBus = await this.busService.update(+id, updateBusDto);
      return {
        message: 'Bus updated successfully',
        data: updatedBus,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ✅ Delete Bus
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.busService.remove(+id);
      return { message: `Bus with ID ${id} deleted successfully` };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // ✅ Assign Driver
  @Post(':busId/assign-driver/:driverId')
  @UseGuards(JwtAuthGuard)
  async assignDriver(
    @Param('busId') busId: string,
    @Param('driverId') driverId: string,
  ) {
    try {
      const updatedBus = await this.busService.assignDriver(+busId, +driverId);
      return {
        message: 'Driver assigned successfully',
        data: updatedBus,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
