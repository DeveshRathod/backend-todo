import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

const Todo = sequelize.define("Todo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "expired"),
    defaultValue: "pending",
  },
});

export default Todo;
