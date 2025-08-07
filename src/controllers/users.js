import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

userRouter.get("/:username/queries", async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).populate(
    "queries"
  );
  if (user) {
    res.json(user.queries);
  } else {
    res.status(404).end();
  }
});

userRouter.post("/register", async (req, res) => {
  const salt = 10;
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    password: passwordHash,
  });

  const savedUser = await newUser.save();
  console.log(savedUser);
  res.status(201).json(savedUser);
});

export default userRouter;
