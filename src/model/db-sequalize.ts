import { Sequelize } from "sequelize";
import { config } from "../config";

export const DB_Sequelize = new Sequelize(
  config.DB_DATABASE_NAME,
  config.DB_USER_NAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOSTNAME,
    dialect: "mysql",
  }
);
