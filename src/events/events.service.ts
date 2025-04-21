import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Event, EventDocument } from "../schemas/event.schema";
import { CreateEventDto } from "../schemas/dto/create-event.dto";

@Injectable()
export class EventsService {
  private readonly PROCESSING_LOCK_TIMEOUT = 300000; // 5 minutes

  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findUnprocessedEvents(limit: number = 100): Promise<EventDocument[]> {
    return this.eventModel
      .find({
        isProcessed: false,
        $or: [
          { processingLock: { $exists: false } },
          {
            processingLock: {
              $lt: new Date(Date.now() - this.PROCESSING_LOCK_TIMEOUT),
            },
          },
        ],
      })
      .limit(limit)
      .exec();
  }

  async acquireProcessingLock(
    eventId: Types.ObjectId,
    serverId: string
  ): Promise<EventDocument | null> {
    return this.eventModel.findOneAndUpdate(
      {
        _id: eventId,
        $or: [
          { processingLock: { $exists: false } },
          {
            processingLock: {
              $lt: new Date(Date.now() - this.PROCESSING_LOCK_TIMEOUT),
            },
          },
        ],
      },
      {
        $set: {
          processingLock: new Date(),
          processingServer: serverId,
        },
      },
      { new: true }
    );
  }

  async markAsProcessed(eventId: Types.ObjectId, error?: any): Promise<void> {
    const update: any = {
      $set: {
        isProcessed: true,
        processedAt: new Date(),
      },
      $unset: {
        processingLock: 1,
        processingServer: 1,
      },
    };

    if (error) {
      update.$set.error = {
        message: error.message,
        stack: error.stack,
        code: error.code,
      };
    }

    await this.eventModel.findByIdAndUpdate(eventId, update);
  }
}
