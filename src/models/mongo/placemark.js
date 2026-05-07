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

  // existing single image
  img: String,
  imgId: String,

  // multiple images 
  images: {
    type: [String],
    default: []
  },

  collectionid: {
    type: Schema.Types.ObjectId,
    ref: "Collection"
  },
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);