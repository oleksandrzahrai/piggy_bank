import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  HttpStatus,
} from '@nestjs/common';
import { DaysService } from './days.service';
import { CreateDayDto } from './dto/create-day.dto';
import { ApiTags } from '@nestjs/swagger';
// import { UpdateDayDto } from './dto/update-day.dto';

@ApiTags('Days')
@Controller('days')
export class DaysController {
  constructor(private readonly daysService: DaysService) {}

  // @Post('init')
  // async init() {
  //   const days = await this.daysService.ensureDays();
  //   return {
  //     statusCode: HttpStatus.OK,
  //     data: { days },
  //   };
  // }

  @Post()
  async day(@Body() data: CreateDayDto) {
    const day = await this.daysService.day(data.amount);
    return {
      statusCode: HttpStatus.OK,
      data: { day },
    };
  }

  @Get()
  async getAll() {
    const days = await this.daysService.getAll();
    return {
      statusCode: HttpStatus.OK,
      data: { days },
    };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.daysService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDayDto: UpdateDayDto) {
  //   return this.daysService.update(+id, updateDayDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.daysService.remove(+id);
  // }
}
