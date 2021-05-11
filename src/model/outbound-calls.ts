import { DataTypes, Model } from "sequelize";
import { DB_Sequelize } from "./db-sequalize";

export class OutboundCalls extends Model {}

OutboundCalls.init(
  {
    callStartTime: {
        type: DataTypes.DATE
    },
    billDuration: {
        type: DataTypes.INTEGER
    },
    billRate: {
        type: DataTypes.FLOAT
    },
    callStatus: {
        type: DataTypes.STRING
    },
    callUUID: {
        type: DataTypes.UUID
    },
    duration: {
        type: DataTypes.FLOAT
    },
    callEndTime: {
        type: DataTypes.DATE
    },
    cost: {
        type: DataTypes.FLOAT
    }
  },
  {
    sequelize: DB_Sequelize,
    timestamps: true,
    modelName: "OutboundCalls",
  }
);

OutboundCalls.sync({ alter: true });
