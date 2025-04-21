import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ProcessedEvent,
  ProcessedEventSchema,
} from "../schemas/processed-event.schema";
import { ProcessedEventsService } from "./processed-events.service";
import { Event, EventSchema } from "../schemas/event.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProcessedEvent.name, schema: ProcessedEventSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  providers: [ProcessedEventsService],
  exports: [ProcessedEventsService],
})
export class ProcessedEventsModule {}
