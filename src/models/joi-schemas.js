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
    name : Joi.string().required(),
    lat :  Joi.number().required(),
    long : Joi.number().required(),
    type : Joi.string().required(),
    description: Joi.string().max(250).optional(),
}