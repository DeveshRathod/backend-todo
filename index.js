import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./database/connection.js";
import userRoutes from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
const __dirname = path.resolve();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});
