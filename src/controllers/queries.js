import Query from "../models/query.js";
import User from "../models/user.js";
import { Router } from "express";
import jwt from "jsonwebtoken";

const queryRouter = Router();

const getAuthToken = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

queryRouter.get("/", async (req, res) => {
  const queries = await Query.find({});
  console.log(queries);
  res.json(queries);
});

queryRouter.post("/", async (req, res) => {
  const body = req.body;
  console.log(body);

  const user = await User.findOne({ username: body.username });
  /* 
  {
    "username": "test",
    "id": "123",
    "url": "google.com",
    "method": "GET",
    "query": {
      "param1": "delete",
      "param2": "me"
    }
  }
 */

  const query = new Query({
    id: body.id,
    url: body.url,
    method: body.method,
    query: body.query,
    user: user._id,
  });

  const savedQuery = await query.save();
  if (savedQuery) {
    user.queries = user.queries.concat(savedQuery._id);
    await user.save();
    console.log(savedQuery);
    res.status(201).json(savedQuery);
  } else {
    res.status(418).end(); // TODO: proper error handling
  }
});

queryRouter.delete("/:id", async (req, res) => {
  const token = jwt.verify(getAuthToken(req), process.env.SECRET);
  console.log(token);
  //const user = await User.findOne({token.username})
  const id = req.params.id;
  const query = await Query.findOne({ id }).populate("user", "username");
  console.log(query);
  try {
    Query.deleteOne({ id });
    res.status(204).end();
  } catch (e) {
    res.status(500).send("Server error.");
  }
});

export default queryRouter;
