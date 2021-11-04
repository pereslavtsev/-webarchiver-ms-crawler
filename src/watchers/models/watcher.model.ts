import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiParams } from 'mwn';

@Entity('watchers')
export class Watcher {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  readonly name: string;

  @Column({ type: 'boolean', default: false })
  readonly active: boolean;

  @Column('json')
  readonly query: ApiParams;

  @Column({ type: 'json', nullable: true })
  readonly continue: ApiParams | null;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
