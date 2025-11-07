import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from './driver/driver.module';
import { Driver } from './driver/entities/driver.entity';
import { Bus } from './bus/entities/bus.entity';
import { BusModule } from './bus/bus.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Driver, 
      Bus,
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'bus_portal',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DriverModule,
    BusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
