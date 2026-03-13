import Mongoose from "mongoose";

const { Schema } = Mongoose;

const collectionSchema = new Schema({
  name: String,
  img: String,
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Collection = Mongoose.model("Collection", collectionSchema);
