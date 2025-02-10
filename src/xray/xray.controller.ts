import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Xray } from '../schemas/x-ray.schema';
import { SignalService } from '../signal/signal.service';
import { CreateXrayDto } from './dto/xray.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('xrays')
@Controller('xray')
export class XrayController {
  constructor(private readonly signalService: SignalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new xray record' })
  @ApiBody({ type: CreateXrayDto })
  @ApiResponse({ status: 201, description: 'Xray record created' })
  @ApiResponse({
    status: 409,
    description: 'Error saving signal: Signal already exists',
  })
  create(@Body() createXrayDto: CreateXrayDto): Promise<Xray> {
    return this.signalService.saveSignal(createXrayDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all xray records' })
  @ApiResponse({ status: 200, description: 'List of xray records' })
  @ApiResponse({ status: 404, description: 'No xray records found' })
  findAll(): Promise<Xray[]> {
    return this.signalService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific xray record by ID' })
  @ApiParam({ name: 'id', description: 'Xray record ID' })
  @ApiResponse({ status: 200, description: 'Xray record found' })
  @ApiResponse({ status: 404, description: 'Xray record not found' })
  findOne(@Param('id') id: string): Promise<Xray> {
    return this.signalService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific xray record by ID' })
  @ApiParam({ name: 'id', description: 'Xray record ID' })
  @ApiBody({ type: CreateXrayDto })
  @ApiResponse({ status: 200, description: 'Xray record updated' })
  @ApiResponse({ status: 404, description: 'Xray record not found' })
  update(
    @Param('id') id: string,
    @Body() updateXrayDto: Partial<CreateXrayDto>,
  ): Promise<Xray> {
    return this.signalService.update(id, updateXrayDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific xray record by ID' })
  @ApiParam({ name: 'id', description: 'Xray record ID' })
  @ApiResponse({ status: 200, description: 'Xray record deleted' })
  @ApiResponse({ status: 404, description: 'Xray record not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.signalService.remove(id);
  }

  @Get('filtered')
  @ApiOperation({ summary: 'Get filtered xray records' })
  @ApiQuery({ name: 'deviceId', description: 'Device ID' })
  @ApiQuery({ name: 'startTime', description: 'Start time' })
  @ApiQuery({ name: 'endTime', description: 'End time' })
  @ApiResponse({ status: 200, description: 'List of filtered xray records' })
  @ApiResponse({ status: 404, description: 'No xray records found' })
  findFiltered(
    @Query('deviceId') deviceId?: string,
    @Query('startTime', ParseIntPipe) startTime?: number,
    @Query('endTime', ParseIntPipe) endTime?: number,
  ): Promise<Xray[]> {
    return this.signalService.findFiltered(deviceId, startTime, endTime);
  }
}
