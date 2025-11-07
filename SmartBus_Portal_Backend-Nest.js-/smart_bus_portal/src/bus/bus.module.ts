import { forwardRef, Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { DriverModule } from 'src/driver/driver.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Driver } from 'src/driver/entities/driver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bus, Driver]),
    forwardRef(() => DriverModule),
  ],
  controllers: [BusController],
  providers: [BusService],
})
export class BusModule {}
