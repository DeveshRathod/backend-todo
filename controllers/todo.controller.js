import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";
import { Sequelize } from "sequelize";

export const getDash = async (req, res) => {
  try {
    const userId = req.user.id;

    const todos = await Todo.findAll({
      where: {
        userId: userId,
      },
    });

    if (!todos) {
      return res.status(404).json({ message: "No todos found for this user." });
    }

    const expiredCount = todos.filter(
      (todo) => todo.status === "expired"
    ).length;
    const remainingCount = todos.filter(
      (todo) => todo.status === "pending"
    ).length;
    const completedCount = todos.filter(
      (todo) => todo.status === "completed"
    ).length;

    res.status(200).json({
      expiredCount,
      remainingCount,
      completedCount,
      totalTodos: todos.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const userId = req.user.id;

    const todos = await Todo.findAll({ where: { userId } });

    const currentDate = new Date();
    let updatedTodos = [];

    for (let todo of todos) {
      const dueDate = new Date(todo.time);

      if (dueDate < currentDate && todo.status !== "completed") {
        todo.status = "expired";
        await todo.save();
      }
      updatedTodos.push(todo);
    }

    res.status(200).json({
      todos: updatedTodos,
      message: "Todos fetched and updated successfully",
    });
  } catch (error) {
    console.error("Error in getAllTodos:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const addTodo = async (req, res) => {
  try {
    const { title, description, time } = req.body;
    const userId = req.user.id;

    const newTodo = await Todo.create({
      title,
      description,
      time,
      status: "pending",
      userId,
    });

    await User.update(
      {
        todos: Sequelize.fn("array_append", Sequelize.col("todos"), newTodo.id),
      },
      { where: { id: userId } }
    );

    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error in addTodo:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id, title, description, time, status } = req.body;
    const userId = req.user.id;

    const todo = await Todo.findOne({ where: { id, userId } });

    if (!todo) {
      return res
        .status(404)
        .json({ message: "Todo not found or does not belong to the user." });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.time = time || todo.time;
    todo.status = status || todo.status;

    await todo.save();

    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error("Error in updateTodo:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;

    const todo = await Todo.findOne({ where: { id } });

    if (!todo) {
      return res
        .status(404)
        .json({ message: "Todo not found or does not belong to the user." });
    }

    await Todo.destroy({ where: { id, userId } });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTodo:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
