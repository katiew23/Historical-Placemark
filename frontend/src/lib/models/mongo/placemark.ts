import mongoose, { type Model } from "mongoose";

export interface Review {
  name: string;
  text: string;
  rating: number;
  userid?: string;
  image?: string;
}

export interface Placemark {
  _id?: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  yearEstablished: number;
  county: string;
  img?: string;
  imgId?: string;
  images?: string[];
  reviews?: Review[];
  userid?: string;
  collectionid?: string;
}

const placemarkSchema = new mongoose.Schema<Placemark>({
  name: String,
  description: String,
  latitude: Number,
  longitude: Number,
  category: String,
  yearEstablished: Number,
  county: String,

  img: String,
  imgId: String,

  images: {
    type: [String],
    default: []
  },

  reviews: [
    {
      name: String,
      text: String,
      rating: Number,
      image: String,

      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],

  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  collectionid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection"
  }
});

if (mongoose.models.Placemark) {
  delete mongoose.models.Placemark;
}

const PlacemarkMongoose: Model<Placemark> =
  mongoose.model<Placemark>("Placemark", placemarkSchema);

export { PlacemarkMongoose };