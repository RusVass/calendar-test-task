import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { EventsService } from './events.service';

type MockQueryResult<T> = {
  exec: jest.Mock<Promise<T>, []>;
};

type MockEventModel = {
  findById: jest.Mock<MockQueryResult<unknown>, [string]>;
  findByIdAndUpdate: jest.Mock<MockQueryResult<unknown>, [string, unknown, unknown]>;
  findByIdAndDelete: jest.Mock<MockQueryResult<unknown>, [string]>;
};

const createQueryResult = <T>(value: T): MockQueryResult<T> => {
  return {
    exec: jest.fn().mockResolvedValue(value),
  };
};

describe('EventsService', () => {
  const validId = new Types.ObjectId().toHexString();
  let service: EventsService;
  let eventModel: MockEventModel;

  beforeEach(() => {
    eventModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    service = new EventsService(eventModel as never);
  });

  it('throws NotFoundException for invalid id in findOne', async () => {
    await expect(service.findOne('invalid-id')).rejects.toBeInstanceOf(NotFoundException);
    expect(eventModel.findById).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when event is missing in findOne', async () => {
    eventModel.findById.mockReturnValue(createQueryResult(null));

    await expect(service.findOne(validId)).rejects.toBeInstanceOf(NotFoundException);
    expect(eventModel.findById).toHaveBeenCalledWith(validId);
  });

  it('trims title and converts dates in update', async () => {
    const expectedEvent = { id: validId };
    eventModel.findByIdAndUpdate.mockReturnValue(createQueryResult(expectedEvent));

    const result = await service.update(validId, {
      title: '  Team sync  ',
      startsAt: '2026-04-09T10:00:00.000Z',
      endsAt: '2026-04-09T11:00:00.000Z',
    });

    expect(result).toBe(expectedEvent);
    expect(eventModel.findByIdAndUpdate).toHaveBeenCalledWith(
      validId,
      {
        title: 'Team sync',
        startsAt: new Date('2026-04-09T10:00:00.000Z'),
        endsAt: new Date('2026-04-09T11:00:00.000Z'),
      },
      { new: true, runValidators: true },
    );
  });

  it('throws NotFoundException when remove target does not exist', async () => {
    eventModel.findByIdAndDelete.mockReturnValue(createQueryResult(null));

    await expect(service.remove(validId)).rejects.toBeInstanceOf(NotFoundException);
    expect(eventModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
  });
});
