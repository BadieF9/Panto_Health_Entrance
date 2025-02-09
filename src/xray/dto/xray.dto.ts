import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class DataPointDto {
  @IsNumber()
  time: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoordinateSpeedDto)
  coordinateSpeed: CoordinateSpeedDto[];
}

class CoordinateSpeedDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  speed: number;
}

export class CreateXrayDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataPointDto)
  data: DataPointDto[];
}
