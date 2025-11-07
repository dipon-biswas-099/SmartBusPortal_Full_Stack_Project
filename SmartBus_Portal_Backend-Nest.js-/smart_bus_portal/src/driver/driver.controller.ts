import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Res,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { DriverService } from './driver.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('driver')
@UsePipes(new ValidationPipe())
export class DriverController {
  // Get all drivers
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllDrivers() {
    return this.driverService.findAll();
  }

  // Update name only (no file upload)
  @Patch(':id/name')
  @UseGuards(JwtAuthGuard)
  async updateName(@Param('id', ParseIntPipe) id: number, @Body() body: { name: string }) {
    return this.driverService.update(id, { name: body.name });
  }
  constructor(private readonly driverService: DriverService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('nidImage', {
      storage: diskStorage({
        destination: './uploads/nid',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(new BadRequestException('No file uploaded'), false);
          return;
        }
        
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          cb(new BadRequestException('Only JPG, JPEG, or PNG files are allowed'), false);
          return;
        }

        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    }),
  )
  async create(
    @Body() createDriverDto: CreateDriverDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('NID image is required and must be under 2MB');
    }
    return this.driverService.create({
      ...createDriverDto,
      nidImage: file.filename,
    });
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDriverDto) {
    try {
      return await this.driverService.validateDriver(loginDto.email, loginDto.password);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Authentication failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      return this.driverService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: false,
    transform: true,
    skipMissingProperties: true,
  }))
  @UseInterceptors(
    FileInterceptor('nidImage', {
      storage: diskStorage({
        destination: './uploads/nid',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file && !file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          cb(new BadRequestException('Only JPG, JPEG, or PNG files are allowed'), false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      console.log('Updating driver ID:', id);
      console.log('Update DTO:', updateDriverDto);
      console.log('File:', file ? file.filename : 'No file');
      
      if (file) {
        updateDriverDto.nidImage = file.filename;
      }
      return this.driverService.update(id, updateDriverDto);
    } catch (error) {
      console.error('Update error in controller:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update driver',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.remove(id);
  }

  @Get('nid/:name')
  getNidImage(@Param('name') name: string, @Res() res: Response) {
    return res.sendFile(name, { root: './uploads/nid' });
  }

  /*  @Patch(':id/assign-buses')
  @UseGuards(JwtAuthGuard)
  async assignBuses(
    @Param('id', ParseIntPipe) id: number,
    @Body('busIds') busIds: number[],
  ) {
    return this.driverService.assignBuses(id, busIds);
  }
  */
}
