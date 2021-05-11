"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(config_1.config.DB_DATABASE_NAME, config_1.config.DB_USER_NAME, config_1.config.DB_PASSWORD, {
    host: config_1.config.DB_HOSTNAME,
    dialect: "mysql",
});
//# sourceMappingURL=index.js.map