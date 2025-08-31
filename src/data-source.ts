import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { DatabaseConfig } from "./configs/config";

// TypeORM DataSource configuration
export const AppDataSource = new DataSource({
  type: DatabaseConfig.TYPE,
  host: DatabaseConfig.HOST,
  port: DatabaseConfig.PORT,
  username: DatabaseConfig.USERNAME,
  password: DatabaseConfig.PASSWORD,
  database: DatabaseConfig.DATABASE,
  synchronize: DatabaseConfig.SYNCHRONIZE,
  logging: DatabaseConfig.LOGGING,
  entities: [User],
  migrations: [],
  subscribers: [],
});
