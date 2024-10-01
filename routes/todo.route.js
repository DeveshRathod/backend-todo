import { Router } from "express";
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  getDash,
  updateTodo,
} from "../controllers/todo.controller.js";
import verifyUser from "../middlewares/verifyUser.js";

const router = Router();

router.post("/getDashboard", verifyUser, getDash);
router.post("/addTodo", verifyUser, addTodo);
router.put("/updateTodo", verifyUser, updateTodo);
router.post("/getTodos", verifyUser, getAllTodos);
router.post("/deleteTodo", verifyUser, deleteTodo);

export default router;
