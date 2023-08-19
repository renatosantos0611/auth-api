import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();
const configService = new ConfigService();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: ['dist/domain/**/entities/*{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
