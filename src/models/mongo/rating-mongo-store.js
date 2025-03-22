import Mongoose from "mongoose";
import { Rating } from "./rating.js";


export const ratingMongoStore = {

    async getAllRatings() {
       const ratings = await Rating.find().lean();
       return ratings;
    },

    async deleteAllRatings() {
    await Rating.deleteMany({});
    },

    async addRating(poiId,userId, rating) {
        rating.poiid = poiId
        rating.userid = userId
        const addRating = new Rating(rating);
        const ratingObj = await addRating.save();
        const r = await this.getRatingById(ratingObj._id);
        return r;
    },

    async getRatingsByUserId(userId) {
             try {
                const ratings = await Rating.find({ userid : userId }).lean();
                return ratings;
            }
             catch (error){
                return [];
             }
            },

    async getRatingsByPoiId(poiId) {
        try {
            const ratings = await Rating.find({ poiid : poiId }).lean();
            return ratings;
        }
         catch (error){
            return [];
         }
        },

    async getRatingsByRatingValue(value) {
        try {
            const ratings = await Rating.find({ rating : value }).lean();
            return ratings;
        }
         catch (error){
            return [];
         }
        },

    async getRatingsByPoiIdRating(poiid, rating) {
        try {
            const ratings = await Rating.find({ rating : rating, poiid : poiid }).lean();
            return ratings;
        }
         catch (error){
            return [];
         }
        },

    async getRatingById(id) {
        if (Mongoose.isValidObjectId(id)) {
            const rating = await Rating.findOne({ _id: id }).lean();
            return rating;
        }
            return null;
        },

    async deleteRatingById(id) {
        try {
                await Rating.deleteOne({ _id: id });
              } catch (error) {
                console.log("bad id");
              }
            },

    async deleteRatingsByUserId(userId) {
        try {
                    await Rating.deleteMany({ userid: userId });
                  } catch (error) {
                    console.log("bad id");
                  }
                },

    async deleteRatingsByPoiId(poiId) {
        try {
            await Rating.deleteMany({ poiid: poiId });
          } catch (error) {
            console.log("bad id");
          }
        },


    async updateRating(rating,updatedRating){
  try {
            await Rating.updateOne({_id:{$eq:rating._id}},
            { comment :updatedRating.comment, rating : updatedRating.rating,locationName : updatedRating.locationName, ratingIconAddress: updatedRating.ratingIconAddress, date : updatedRating.date})
        }
            catch (error) {
                console.log("Issue with rating")
        
            }},

    async updateRatingUser(user) {
      try {
            await Rating.updateMany({userid : {$eq:user._id}},
            {user : `${user.firstName} ${user.surname}`}
            )
        }
        catch (error) {
           console.log("issue with user")
        }
    },

    async updateRatingPoi(poi) {
        try {
            await Rating.updateMany({poiid : {$eq:poi._id}},
            {locationName : poi.location}
            )
        }
        catch (error) {
           console.log("issue with location")
        }
    },
};
