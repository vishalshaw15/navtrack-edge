import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ProcessedEvent,
  ProcessedEventSchema,
} from "../schemas/processed-event.schema";
import { ProcessedEventsService } from "./processed-events.service";
import { Event, EventSchema } from "../schemas/event.schema";
import { ProcessedEventsController } from "./processed-events.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProcessedEvent.name, schema: ProcessedEventSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [ProcessedEventsController],
  providers: [ProcessedEventsService],
  exports: [ProcessedEventsService],
})
export class ProcessedEventsModule {}
