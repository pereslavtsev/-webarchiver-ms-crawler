import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiParams } from 'mwn';
import { watchers } from '@pereslavtsev/webarchiver-protoc';
import { IsJSON, IsString, IsUUID } from 'class-validator';
import { TransformDate } from '@crawler/shared';

@Entity('watchers')
export class Watcher implements watchers.Watcher {
  static Status = watchers.Watcher_Status;

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  readonly id: string;

  @Column()
  @IsString()
  readonly name: string;

  @Column({
    type: 'enum',
    enumName: 'watcher_status',
    enum: Watcher.Status,
    default: Watcher.Status.PENDING,
  })
  readonly status: watchers.Watcher_Status;

  @Column('json')
  @IsJSON()
  readonly initialQuery: ApiParams | string;

  @Column({ type: 'json', nullable: true })
  @IsJSON()
  readonly continueQuery: ApiParams | null;

  @CreateDateColumn()
  @TransformDate()
  readonly createdAt: Date;

  @UpdateDateColumn()
  @TransformDate()
  readonly updatedAt: Date;
}
