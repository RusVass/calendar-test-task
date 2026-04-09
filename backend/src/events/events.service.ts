import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './schemas/event.schema';

const EVENT_NOT_FOUND_ERROR = 'Event not found';
const INVALID_EVENT_DATES_ERROR = 'Invalid start or end date';
const INVALID_EVENT_RANGE_ERROR = 'End date must be greater than start date';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  private validateEventDates = (start: string | Date, end: string | Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException(INVALID_EVENT_DATES_ERROR);
    }

    if (endDate <= startDate) {
      throw new BadRequestException(INVALID_EVENT_RANGE_ERROR);
    }
  };

  create = async (createEventDto: CreateEventDto) => {
    this.validateEventDates(createEventDto.start, createEventDto.end);

    const event = await this.eventModel.create({
      ...createEventDto,
      start: new Date(createEventDto.start),
      end: new Date(createEventDto.end),
    });

    return this.mapEvent(event);
  };

  findAll = async () => {
    const events = await this.eventModel.find().sort({ start: 1 }).exec();

    return events.map(this.mapEvent);
  };

  findOne = async (id: string) => {
    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new NotFoundException(EVENT_NOT_FOUND_ERROR);
    }

    return this.mapEvent(event);
  };

  update = async (id: string, updateEventDto: UpdateEventDto) => {
    const currentEvent = await this.eventModel.findById(id).exec();

    if (!currentEvent) {
      throw new NotFoundException(EVENT_NOT_FOUND_ERROR);
    }

    const nextStart = updateEventDto.start ?? currentEvent.start;
    const nextEnd = updateEventDto.end ?? currentEvent.end;

    this.validateEventDates(nextStart, nextEnd);

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(
        id,
        {
          ...updateEventDto,
          ...(updateEventDto.start ? { start: new Date(updateEventDto.start) } : {}),
          ...(updateEventDto.end ? { end: new Date(updateEventDto.end) } : {}),
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException(EVENT_NOT_FOUND_ERROR);
    }

    return this.mapEvent(updatedEvent);
  };

  remove = async (id: string) => {
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();

    if (!deletedEvent) {
      throw new NotFoundException(EVENT_NOT_FOUND_ERROR);
    }

    return {
      message: 'Event deleted successfully',
      id,
    };
  };

  private mapEvent = (event: EventDocument) => {
    return {
      id: event._id.toString(),
      title: event.title,
      start: event.start,
      end: event.end,
      color: event.color,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  };
}
