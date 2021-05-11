"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_Sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
exports.DB_Sequelize = new sequelize_1.Sequelize(config_1.config.DB_DATABASE_NAME, config_1.config.DB_USER_NAME, config_1.config.DB_PASSWORD, {
    host: config_1.config.DB_HOSTNAME,
    dialect: "mysql",
});
//# sourceMappingURL=db-sequalize.js.map