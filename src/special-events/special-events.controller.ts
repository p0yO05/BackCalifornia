import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { SpecialEventsService } from './special-events.service';
import { CreateSpecialEventDto } from './dto/create-special-event.dto';
import { UpdateSpecialEventResultDto } from './dto/update-special-eventresults.dto';

@Controller('special-events')
export class SpecialEventsController {
  constructor(private readonly specialEventsService: SpecialEventsService) {}

  @Post()
  create(@Body() createEventDto: CreateSpecialEventDto) {
    return this.specialEventsService.createEvent(createEventDto);
  }

  @Get()
  findAll() {
    return this.specialEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialEventsService.findOne(id);
  }

  @Patch(':id/results')
  updateResults(
    @Param('id') id: string,
    @Body() updateDto: UpdateSpecialEventResultDto,
  ) {
    return this.specialEventsService.updateEventResults(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialEventsService.remove(id);
  }
}