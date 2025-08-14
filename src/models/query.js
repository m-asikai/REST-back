import mongoose from "mongoose";
import "dotenv/config";

const querySchema = new mongoose.Schema({
  id: String,
  url: String,
  method: String,
  query: Object,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

querySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Query = mongoose.model("Query", querySchema);

export default Query;
