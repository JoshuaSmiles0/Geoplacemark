

export const storeUtils = {

    getTypeIcon(type) {
        let typeIconAddress = null;
        switch(type) {
            case "economic":
                typeIconAddress = "/images/economicLocation.jpg";
            break;
            case "mineralogical":
                typeIconAddress = "/images/mineralLocation.jpg";
            break;
            case "palaeo":
                typeIconAddress = "/images/fossilLocation.jpg";
            break;
            default:
                typeIconAddress = "/images/geoplacemarkLogo.jpg";
        }
        return typeIconAddress;
    },

    getRatingIcon(rating) {
        let ratingIconAddress = null;
        switch(rating) {
            case "1":
                ratingIconAddress = "/images/oneStar.png";
            break;
            case "2":
                ratingIconAddress = "/images/twoStar.png";
            break;
            case "3":
                ratingIconAddress = "/images/threeStar.png";
            break;
            case "4":
                ratingIconAddress = "/images/fourStar.png";
            break;
            case "5":
                ratingIconAddress = "/images/fiveStar.png";
            break;
            default:
                ratingIconAddress = "/images/notRated.png";
        }
        return ratingIconAddress;
    },

    getAverageRating(ratings) {
        let i = 0
        ratings.forEach(rate => {
            i += Number(rate.rating)
        })
        i /= ratings.length
        if(i > 0){
        return Math.round(i);
    };
    return 0;
},

    

}