import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverDto } from './create-driver.dto';
import { IsString, IsOptional, IsArray, IsNumber, IsEmail, MinLength, Matches } from 'class-validator';

export class UpdateDriverDto {
    @IsOptional()
    @IsString()
    @Matches(/^[A-Za-z\s]+$/, {
        message: 'Name must contain only alphabets',
    })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid email format' })
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{10,17}$/, {
        message: 'NID must be between 10 to 17 digits',
    })
    nid?: string;

    @IsOptional()
    @IsString()
    nidImage?: string;

    @IsOptional()
    @IsNumber()
    busId?: number;
     
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    busIds?: number[];
}