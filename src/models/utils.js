
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
    }

    

}