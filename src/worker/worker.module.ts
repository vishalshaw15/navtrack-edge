import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PollingService } from "./polling.service";
import { EventsModule } from "../events/events.module";
import { Event, EventSchema } from "../schemas/event.schema";
import { AppService } from "../app.service";
import { ProcessedEventsModule } from "../processed-events/processed-events.module";

@Module({
  imports: [
    EventsModule,
    ProcessedEventsModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  providers: [PollingService, AppService],
  exports: [PollingService],
})
export class WorkerModule {}
