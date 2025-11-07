import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { Driver } from './entities/driver.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { Bus } from 'src/bus/entities/bus.entity';
import { BusModule } from 'src/bus/bus.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, Bus]),
   forwardRef(() => BusModule),  // ✅ use NestJS forwardRef, not your own
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [DriverController],
  providers: [DriverService, JwtStrategy],
  exports: [DriverService],
})
export class DriverModule {}
