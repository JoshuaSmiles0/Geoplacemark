import Joi from "joi";


export const userSchema = {
    firstName : Joi.string().required(),
    surname : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().required()
};

export const userLoginSchema = {
    email : Joi.string().email().required(),
    password : Joi.string().required()
};

export const poiSchema = {
    location : Joi.string().required(),
    lat :  Joi.number().required(),
    long : Joi.number().required(),
    type : Joi.string().valid("economic", "palaeo","mineralogical" ).required(),
    description: Joi.string().max(250).required(),
};

export const ratingSchema = {
    comment : Joi.string().max(250).required(),
    rating : Joi.string().valid("1","2","3","4","5").required(),
};

