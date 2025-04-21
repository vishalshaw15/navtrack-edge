import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type EventDocument = Event & Document;

@Schema({
  timestamps: true,
  collection: "events",
})
export class Event {
  _id: Types.ObjectId;

  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  sharedSecretToken: string;

  @Prop({ default: false })
  isProcessed: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  processedAt: Date;

  @Prop()
  processingLock: Date;

  @Prop()
  processingServer: string;

  @Prop({ type: Object })
  error: {
    message: string;
    stack?: string;
    code?: string;
  };
}

export const EventSchema = SchemaFactory.createForClass(Event);

// Indexes
EventSchema.index({ isProcessed: 1 });
EventSchema.index({ processingLock: 1 });
EventSchema.index({ createdAt: 1 });
EventSchema.index({ userId: 1 });
