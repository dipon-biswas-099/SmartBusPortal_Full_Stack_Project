import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  busNumber: string;

  @IsString()
  @IsNotEmpty()
  route: string;

  @IsInt()
  capacity: number;

  @IsInt()
  driverId: number;   // 👈 to link with driver
}
