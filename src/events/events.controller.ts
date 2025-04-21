import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "../schemas/dto/create-event.dto";

@Controller("events")
@UsePipes(new ValidationPipe({ transform: true }))
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    try {
      const event = await this.eventsService.create(createEventDto);
      if (!event) {
        throw new HttpException(
          "Failed to create event",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to create event",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
