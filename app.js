import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/controllers/users.js";
import queryRouter from "./src/controllers/queries.js";
import cors from "cors";

const app = express();
const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(console.log("Connected"))
  .catch((error) => {
    console.log("Error connectiong to mongoDB.", error.message);
  });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    name: "Test",
    age: 43,
  });
});

app.post("/", (req, res) => {
  const { body } = req;
  console.log(body);
  res.status(200).send();
});

app.use("/api/user", userRouter);
app.use("/api/query", queryRouter);

export default app;
