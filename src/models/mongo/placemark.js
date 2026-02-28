import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
  name: String,
  description: String,
  latitude: Number,
  longitude: Number,
  category: String,
  yearEstablished: Number,
  county: String,
  collectionid:{
    type: Schema.Types.ObjectId,
    ref: "Collection"
  },
});
export const Placemark = Mongoose.model("Placemark", placemarkSchema);
