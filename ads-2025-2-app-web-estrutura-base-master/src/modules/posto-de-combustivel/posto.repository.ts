// posto.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Posto } from './posto.entity';

export const postoProviders = [
  {
    provide: 'POSTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Posto),
    inject: ['DATA_SOURCE'],
  },
];