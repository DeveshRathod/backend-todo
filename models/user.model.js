import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";
import Todo from "./todo.model.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email must be unique",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  }
);

User.hasMany(Todo, {
  foreignKey: "userId",
  as: "todos",
});

Todo.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default User;
