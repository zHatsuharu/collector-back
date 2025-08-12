import { DataSource, DataSourceOptions } from "typeorm";

require('dotenv').config();

export const dataSourceOptions: DataSourceOptions  = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: parseInt(process.env.DATABASE_PORT ?? '5432'),
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: ['**/*.entity{ .ts,.js}'],
    migrations: ['src/db/migration/*'],
    synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;