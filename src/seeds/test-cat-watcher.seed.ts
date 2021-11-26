import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Watcher } from '@crawler/watchers';
import { categoryMembersQuery } from '@crawler/watchers/api.helpers';

export default class TestCatWatcher implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(Watcher).save({
      id: '6eaf8d65-3b3a-4099-8f1d-1defd429d3be',
      initialQuery: categoryMembersQuery('Программное обеспечение по алфавиту'),
      name: 'test_cat',
    });
  }
}
