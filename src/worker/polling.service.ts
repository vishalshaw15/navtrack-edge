import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { EventsService } from "../events/events.service";
import { AppService } from "../app.service";
import { ProcessedEventsService } from "../processed-events/processed-events.service";
import { EventDocument } from "../schemas/event.schema";

@Injectable()
export class PollingService implements OnModuleInit {
  private readonly POLLING_INTERVAL = 5000; // 5 seconds
  private pollingInterval: NodeJS.Timeout;

  constructor(
    private readonly eventsService: EventsService,
    private readonly appService: AppService,
    private readonly processedEventsService: ProcessedEventsService
  ) {}

  onModuleInit() {
    this.startPolling();
  }

  private startPolling() {
    console.log("Starting polling");
    this.pollingInterval = setInterval(
      () => this.processUnprocessedEvents(),
      this.POLLING_INTERVAL
    );
  }

  private async processUnprocessedEvents() {
    const unprocessedEvents = await this.eventsService.findUnprocessedEvents();
    console.log(`Found ${unprocessedEvents.length} unprocessed events`);

    for (const event of unprocessedEvents) {
      try {
        const serverId = process.env.SERVER_ID || "unknown";
        const lockedEvent = await this.eventsService.acquireProcessingLock(
          event._id,
          serverId
        );

        if (!lockedEvent) {
          continue;
        }

        await this.processEvent(lockedEvent);
      } catch (error) {
        console.error(`Error processing event ${event._id}:`, error);
        await this.eventsService.markAsProcessed(event._id, error);
      }
    }
  }

  private async processEvent(event: EventDocument): Promise<void> {
    try {
      const secretToken = event.sharedSecretToken;
      console.log("secretToken", secretToken);
      const tokenData = this.appService.decryptSso(secretToken);

      const processedEvent = {
        originalEventId: event._id,
        userId: tokenData.userId,
        companyId: tokenData.companyId,
        role: tokenData.role,
        userName: tokenData.userName,
        email: tokenData.email,
        processingTime: Date.now() - event.createdAt.getTime(),
        processedAt: new Date(),
        metadata: event.payload,
        url: event.payload.url,
        timeSpent: event.payload.timeSpent,
      };

      await this.processedEventsService.createFromEvent(processedEvent);
      await this.eventsService.markAsProcessed(event._id);
    } catch (error) {
      await this.eventsService.markAsProcessed(event._id, error);
      throw error;
    }
  }

  onModuleDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}
