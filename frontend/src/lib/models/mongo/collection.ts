import mongoose, { type Model } from "mongoose";

export interface Collection {
  _id?: string;
  name: string;
  img?: string;
  userid: string;
  placemarks?: any[];
}

const collectionSchema = new mongoose.Schema<Collection>({
  name: String,
  img: String,
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

let CollectionMongoose: Model<Collection>;

try {
  CollectionMongoose = mongoose.model<Collection>("Collection");
} catch {
  CollectionMongoose = mongoose.model<Collection>("Collection", collectionSchema);
}

export { CollectionMongoose };