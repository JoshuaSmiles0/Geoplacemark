import Mongoose from "mongoose";
import { Poi } from "./poi.js";

// methods for writing poi data to mongo

export const poiMongoStore = {

    async getAllPoi() {
    const pois = await Poi.find().lean();
    return pois;
    },

    async deleteAllPoi() {
    await Poi.deleteMany({});
    },

    async addPoi(poi) {
     const addPoi = new Poi(poi);
     const poiObj = await addPoi.save();
     const p = await this.getPoiById(poiObj._id);
     return p;
    },

    async getPoiById(id) {
        if (Mongoose.isValidObjectId(id)) {
                const poi = await Poi.findOne({ _id: id }).lean();
                return poi;
              }
              return null;
            },

    async getPoiByUserId(userid) {
        try {
        const poi = await Poi.find({ userid : userid }).lean();
        return poi;
    }
     catch (error){
        return [];
     }
    },

    async deletePoiByUserId(userid) {
        try {
            await Poi.deleteMany({ userid: userid });
          } catch (error) {
            console.log("bad id");
          }
        },

    async deletePoiById(id) {
    try {
        await Poi.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
    },

    async getPoiByType(type) {
        try {
            const poi = await Poi.find({ type : type }).lean();
            return poi;
        }
         catch (error){
            return [];
         }
        },

    async getPoiByUserIdType(userid, type) {
        try {
            const poi = await Poi.find( {userid : userid, type : type }).lean();
            return poi;
        }
         catch (error){
            return [];
         }
        },


    async updatePoi(poi, updatedPoi) {
        try {
            await Poi.updateOne({_id:{$eq:poi._id}},
            { location :updatedPoi.location, lat : updatedPoi.lat, long: updatedPoi.long, type : updatedPoi.type, description : updatedPoi.description, iconAddress : updatedPoi.iconAddress })
        }
            catch (error) {
                console.log("Issue with poi")
        
            }},

    async updatePoiUser(user) {
        try {
            await Poi.updateMany({userid : {$eq:user._id}},
            {author : `${user.firstName} ${user.surname}`}
            )
        }
        catch (error) {
           console.log("issue with user")
        }
    },
    };