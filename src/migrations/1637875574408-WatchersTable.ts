import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { watchers } from '@pereslavtsev/webarchiver-protoc';

const watchersTable = new Table({
  name: 'watchers',
  columns: [
    {
      name: 'id',
      type: 'uuid',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'uuid',
    },
    {
      name: 'name',
      type: 'varchar',
    },
    {
      name: 'initial_query',
      type: 'json',
    },
    {
      name: 'continue_query',
      type: 'json',
      isNullable: true,
    },
    {
      name: 'status',
      type: 'numeric',
      enum: [...Object.values(watchers.Watcher_Status).values()].map((value) =>
        String(value),
      ),
      enumName: 'task_status',
      default: String(watchers.Watcher_Status.PENDING),
    },
    {
      name: 'created_at',
      type: 'timestamp',
      default: 'now()',
    },
    {
      name: 'updated_at',
      type: 'timestamp',
      default: 'now()',
    },
  ],
});

export class WatchersTable1637875574408 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(watchersTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([queryRunner.dropTable(watchersTable)]);
  }
}
