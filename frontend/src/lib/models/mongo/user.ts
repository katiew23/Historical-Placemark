import mongoose, { type Model } from "mongoose";

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

const userSchema = new mongoose.Schema<User>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user"
  }
});

let UserMongoose: Model<User>;

try {
  UserMongoose = mongoose.model<User>("User");
} catch {
  UserMongoose = mongoose.model<User>("User", userSchema);
}

export { UserMongoose };