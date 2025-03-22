
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const ratingSchema = new Schema({
  comment: String,
  rating: String,
  locationName: String,
  ratingIconAddress : String,
  date : Date,
  user : String,
  poiid : {
    type : Schema.Types.ObjectId,
    ref : "Poi"
  },
  userid : {
    type : Schema.Types.ObjectId,
    ref : "User"
  },
});

export const Rating = Mongoose.model("Rating", ratingSchema);
