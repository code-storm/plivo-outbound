"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboundCalls = void 0;
const sequelize_1 = require("sequelize");
const db_sequalize_1 = require("./db-sequalize");
class OutboundCalls extends sequelize_1.Model {
}
exports.OutboundCalls = OutboundCalls;
OutboundCalls.init({
    phloId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_sequalize_1.DB_Sequelize,
    timestamps: true,
    modelName: "OutboundCalls",
});
OutboundCalls.sync({ alter: true });
//# sourceMappingURL=outbound-calls.js.map