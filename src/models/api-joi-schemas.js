import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");


export const userLoginSpec = Joi.object()
.keys({
    email : Joi.string().example("tom.jones@gmail.com").email().required(),
    password : Joi.string().example("secret").required()
}).label("UserLoginSpec");


export const userSpec = userLoginSpec.keys({

    firstName : Joi.string().example("Tom").required(),
    surname : Joi.string().example("Jones").required(),
}).label("UserDetails");

export const userSpecPlus = userSpec.keys({
    _id : IdSpec,
    __v: Joi.number()
}).label("UserSpecPlus");


export const UserArray = Joi.array().items(userSpecPlus).label("UserArray");


export const poiSpec = Joi.object()
.keys({
    location : Joi.string().example("silvermines").required(),
    lat :  Joi.string().example("53.65394778470117").required(),
    long : Joi.string().example("-6.720177158598912").required(),
    type : Joi.string().example("economic").valid("economic", "palaeo","mineralogical" ).required(),
    description: Joi.string().example("A disused mine with plenty of economic minerals").max(250).required(),
    userid : IdSpec,
    author : Joi.string().example("Joe Bloggs").required(),
    iconAddress : Joi.string().example("an icon path").required(),

}).label("PoiSpec");

export const poiSpecPlus = poiSpec.keys({
    _id : IdSpec,
    __v: Joi.number()
}).label("PoiSpecPlus")

export const poiArray = Joi.array().items(poiSpecPlus).label("PoiArray");

export const ratingSpec = Joi.object()
.keys({
    comment : Joi.string().example("A cool place to visit").max(250).required(),
    rating : Joi.string().example("4").valid("1","2","3","4","5").required(),
    locationName: Joi.string().example("silvermines").required(),
    userid : IdSpec,
    poiid : IdSpec,
    ratingIconAddress : Joi.string().example("an icon address").required(),
    date : Joi.date().example("2025-03-23T08:57:47.095+00:00").required(),
    user : Joi.string().example("Joe bloggs").required(),
}).label("RatingSpec")

export const ratingSpecPlus = ratingSpec.keys({
    _id : IdSpec,
    __v: Joi.number()
}).label("RatingSpecPlus")

export const ratingArray = Joi.array().items(ratingSpecPlus).label("RatingArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");
    
