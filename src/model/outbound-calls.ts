import { DataTypes, Model } from "sequelize";
import { DB_Sequelize } from "./db-sequalize";

export class OutboundCalls extends Model {}

OutboundCalls.init(
  {
    phloId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: DB_Sequelize,
    timestamps: true,
    modelName: "OutboundCalls",
  }
);

OutboundCalls.sync({ alter: true });
