import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./database/connection.js";
import userRoutes from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js";

const app = express();
dotenv.config();

// Enable CORS for all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "authorization"],
  })
);

app.use(express.json());
const __dirname = path.resolve();

// Health route
app.use("/health", (req, res) => {
  console.log();

  res.status(200).send("Server is healthy");
});

// Connect
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
