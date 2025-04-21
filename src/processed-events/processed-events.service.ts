import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ProcessedEvent,
  ProcessedEventDocument,
} from "../schemas/processed-event.schema";
import { Event, EventDocument } from "../schemas/event.schema";
import { MongoError } from "mongodb";

interface FindAllOptions {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  type?: string;
}

interface ProcessingStats {
  totalProcessed: number;
  byType: Record<string, number>;
  bySource: Record<string, number>;
  processingTime: {
    min: number;
    max: number;
    avg: number;
  };
}

@Injectable()
export class ProcessedEventsService {
  constructor(
    @InjectModel(ProcessedEvent.name)
    private readonly processedEventModel: Model<ProcessedEventDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>
  ) {}

  async createFromEvent(
    event: Partial<ProcessedEventDocument>
  ): Promise<ProcessedEventDocument> {
    try {
      // First check if event was already processed
      const existingProcessedEvent = await this.processedEventModel.findOne({
        originalEventId: event._id,
      });

      if (existingProcessedEvent) {
        return existingProcessedEvent;
      }

      const processedEvent = new this.processedEventModel({
        originalEventId: event._id,
        ...event,
      });

      const savedEvent = await processedEvent.save();
      if (!savedEvent) {
        throw new Error("Failed to save processed event");
      }
      return savedEvent;
    } catch (error) {
      if (error instanceof MongoError && error.code === 11000) {
        // Duplicate key error - event was already processed
        const existingEvent = await this.processedEventModel.findOne({
          originalEventId: event._id,
        });
        if (!existingEvent) {
          throw new Error(
            "Failed to find existing processed event after duplicate key error"
          );
        }
        return existingEvent;
      }
      throw error;
    }
  }

  async findAll(
    options: FindAllOptions = {}
  ): Promise<{ data: ProcessedEventDocument[]; total: number }> {
    const { page = 1, limit = 10, startDate, endDate, type } = options;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    if (type) {
      query.type = type;
    }

    const [data, total] = await Promise.all([
      this.processedEventModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.processedEventModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<ProcessedEventDocument | null> {
    return this.processedEventModel.findById(id).exec();
  }

  async getProcessingStats(): Promise<ProcessingStats> {
    const stats = await this.processedEventModel.aggregate([
      {
        $group: {
          _id: null,
          totalProcessed: { $sum: 1 },
          byType: { $push: "$type" },
          bySource: { $push: "$source" },
          processingTimes: { $push: "$processingTime" },
        },
      },
    ]);

    if (!stats.length) {
      return {
        totalProcessed: 0,
        byType: {},
        bySource: {},
        processingTime: { min: 0, max: 0, avg: 0 },
      };
    }

    const { totalProcessed, byType, bySource, processingTimes } = stats[0];

    return {
      totalProcessed,
      byType: byType.reduce((acc: Record<string, number>, type: string) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}),
      bySource: bySource.reduce(
        (acc: Record<string, number>, source: string) => {
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        },
        {}
      ),
      processingTime: {
        min: Math.min(...processingTimes),
        max: Math.max(...processingTimes),
        avg:
          processingTimes.reduce((a: number, b: number) => a + b, 0) /
          totalProcessed,
      },
    };
  }
}
