import Mongoose from "mongoose";
import { Image } from "./image.js";

export const imageMongoStore = {


    async addImage(url,poiid) {
    const image = {
       url: url,
       poiid: poiid
     };
     const addImage = new Image(image);
     const imgObj = await addImage.save();
     const i = await this.getImageById(imgObj._id);
     return i;
    },
  
    async getImageById(id) {
        if (Mongoose.isValidObjectId(id)) {
                const image = await Image.findOne({ _id: id }).lean();
                return image;
              }
              return null;
            },


    async getImageByPoiId(pid) {
        try {
        const img = await Image.find({ poiid : pid }).lean();
        return img;
    }
     catch (error){
        return [];
     }
    },
  
  async deleteImageById(id) {
    try {
        await Image.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
    },
}