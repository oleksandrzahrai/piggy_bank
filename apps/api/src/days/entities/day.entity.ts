import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('days')
export class Day {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dayNumber!: number;

  @Column({ default: false })
  isPaid!: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  paidAt!: Date | null;
}
