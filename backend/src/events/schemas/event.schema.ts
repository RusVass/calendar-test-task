import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Event {
  @Prop({
    required: true,
    trim: true,
    maxlength: 30,
  })
  title: string;

  @Prop({
    required: true,
  })
  start: Date;

  @Prop({
    required: true,
  })
  end: Date;

  @Prop({
    required: true,
    trim: true,
  })
  color: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
