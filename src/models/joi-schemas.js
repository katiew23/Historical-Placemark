import Joi from "joi";

export const UserSpec = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}) ;

export const UserCredentialsSpec = Joi.object({ 
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const PlacemarkSpec = Joi.object({   
  name: Joi.string().min(1).required(),
  description: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  category: Joi.string().required(),
  yearEstablished: Joi.number().integer().required(),
  county: Joi.string().required(),
});

export const CollectionSpec = Joi.object({   
  name: Joi.string().required().min(1),
});

