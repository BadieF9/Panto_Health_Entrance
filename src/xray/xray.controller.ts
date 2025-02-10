import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Xray } from '../schemas/x-ray.schema';
import { SignalService } from '../signal/signal.service';
import { CreateXrayDto } from './dto/xray.dto';

@Controller('xray')
export class XrayController {
  constructor(private readonly signalService: SignalService) {}

  @Post()
  create(@Body() createXrayDto: CreateXrayDto): Promise<Xray> {
    return this.signalService.saveSignal(createXrayDto);
  }

  @Get()
  findAll(): Promise<Xray[]> {
    return this.signalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Xray> {
    return this.signalService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateXrayDto: Partial<CreateXrayDto>,
  ): Promise<Xray> {
    return this.signalService.update(id, updateXrayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.signalService.remove(id);
  }

  @Get('filtered')
  findFiltered(
    @Query('deviceId') deviceId?: string,
    @Query('startTime', ParseIntPipe) startTime?: number,
    @Query('endTime', ParseIntPipe) endTime?: number,
  ): Promise<Xray[]> {
    return this.signalService.findFiltered(deviceId, startTime, endTime);
  }
}
