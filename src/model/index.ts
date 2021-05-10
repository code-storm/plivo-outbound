import { config } from "../config";
import { DataTypes, Model, Sequelize } from "sequelize";

const sequelize = new Sequelize(
  config.DB_DATABASE_NAME,
  config.DB_USER_NAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOSTNAME,
    dialect: "mysql",
  }
);
