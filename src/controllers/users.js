import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const { username } = await newUser.save();
  const token = jwt.sign(username, process.env.SECRET);
  res.status(200).send({ username, token });
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid username or password.",
    });
  }
  const token = jwt.sign(username, process.env.SECRET);
  res.status(200).send({ username, token });
});

export default userRouter;
