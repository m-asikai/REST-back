import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/controllers/users.js";
import queryRouter from "./src/controllers/queries.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(console.log("Connected"))
  .catch((error) => {
    console.log("Error connectiong to mongoDB.", error.message);
  });

app.use("/api/user", userRouter);
app.use("/api/query", queryRouter);

export default app;
