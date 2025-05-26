import Mongoose from "mongoose";

// Mongo schema for db image objects 

const { Schema } = Mongoose;

const imageSchema = new Schema({
  url: String,
  poiid : {
    type : Schema.Types.ObjectId,
    ref: "Poi",
  },
});

export const Image = Mongoose.model("Image", imageSchema);