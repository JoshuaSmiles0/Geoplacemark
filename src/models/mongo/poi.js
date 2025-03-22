import Mongoose from "mongoose";

const { Schema } = Mongoose;

const poiSchema = new Schema({
  location: String,
  lat: String,
  long: String,
  type: String,
  description: String,
  userid : {
    type : Schema.Types.ObjectId,
    ref: "User",
  },
  author : String,
  iconAddress : String,
});

export const Poi = Mongoose.model("Poi", poiSchema);

