import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateDayDto } from './dto/create-day.dto';
// import { UpdateDayDto } from './dto/update-day.dto';
import { Day as DayEntity } from './entities/day.entity';
import { Day } from './interfaces/day.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class DaysService {
  constructor(
    @InjectRepository(DayEntity)
    private dayRepository: Repository<DayEntity>,
  ) {}

  // створити 365 днів (запустити 1 раз)
  async initDays() {
    const count = await this.dayRepository.count();
    if (count) return;

    const days = Array.from({ length: 365 }, (_, i) =>
      this.dayRepository.create({ dayNumber: i + 1 }),
    );

    await this.dayRepository.save(days);
  }

  async day(amount: number[]) {
    const now = new Date();

    await this.dayRepository.update(
      { dayNumber: In(amount) },
      {
        isPaid: true,
        paidAt: now,
      },
    );

    return true;
  }

  async getAll(): Promise<Day[]> {
    return this.dayRepository.find({ order: { dayNumber: 'ASC' } });
  }

  async getProgress() {
    const paid = await this.dayRepository.find({ where: { isPaid: true } });
    const total = paid.reduce((s, d) => s + d.dayNumber, 0);
    return { total };
  }

  // async create: CreateDayDto) {
  //   return 'This action adds a new day';
  // }

  // findAll() {
  //   return `This action returns all days`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} day`;
  // }

  // update(id: number, updateDayDto: UpdateDayDto) {
  //   return `This action updates a #${id} day`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} day`;
  // }
}
