import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProcessedEventDocument = ProcessedEvent & Document;

@Schema({
  timestamps: true,
  collection: "processed_events",
})
export class ProcessedEvent {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "Event" })
  originalEventId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: false })
  locationId: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  timeSpent: number;

  @Prop({ required: false, type: Object })
  metadata?: Record<string, any>;

  @Prop({ required: false })
  processingTime?: number; // in milliseconds

  @Prop({ required: false })
  processedAt?: Date;

  @Prop({ type: Object, required: false })
  processingResult?: Record<string, any>;
}

export const ProcessedEventSchema =
  SchemaFactory.createForClass(ProcessedEvent);

// Indexes
ProcessedEventSchema.index({ originalEventId: 1 }, { unique: true });
ProcessedEventSchema.index({ type: 1 });
ProcessedEventSchema.index({ userId: 1 });
ProcessedEventSchema.index({ processingStatus: 1 });
ProcessedEventSchema.index({ processedAt: 1 });
