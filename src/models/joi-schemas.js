import Joi from "joi";

export const IdSpec = Joi.alternatives()
  .try(Joi.string(), Joi.object())
  .description("a valid ID"); // added this to make it clear that this is an ID, not just any string or object. It also allows for flexibility in the type of ID used (e.g. string for MongoDB, object for other databases).

export const UserSpec = Joi.object({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
  email: Joi.string().example("homer@simpson.com").email().required(),
  password: Joi.string().example("secret").required(),
  _id: IdSpec,
  __v: Joi.number(),}) 
.label("UserSpec");
export const UserArraySpec = Joi.array().items(UserSpec).label("UserArray");

export const UserCredentialsSpec = Joi.object({ 
  email: Joi.string().example("homer@simpson.com").email().required(),
  password: Joi.string().example("secret").required(),
})
.label("UserCredentialsSpec");
export const UserAuthSpec = UserCredentialsSpec.label("UserAuthSpec");

// The response schema represents the object returned by the database store.
// When a placemark is saved, the store automatically attaches the id of the
// collection it belongs to. In the Playtime → Placemark labs this field is
// called `collectionid` (all lowercase). Joi response validation is strict,
// so the field name here must match exactly what the store returns. If the
// casing does not match (e.g. collectionId vs collectionid) Joi rejects the
// response and the API returns a 500 error.

export const PlacemarkSpec = Joi.object({
  name: Joi.string().example("Clonmacnoise").min(1).required(),
  description: Joi.string().example("Ancient monastic site on the River Shannon").required(),
  latitude: Joi.number().example(53.3244).min(-90).max(90).required(),
  longitude: Joi.number().example(-7.9862).min(-180).max(180).required(),
  category: Joi.string().example("Monastery").required(),
  yearEstablished: Joi.number().example(544).integer().required(),
  county: Joi.string().example("Offaly").required(),
}).label("PlacemarkSpec");

export const PlacemarkResponseSpec = PlacemarkSpec.keys({
  _id: IdSpec,
  collectionid: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkResponseSpec");

export const PlacemarkArraySpec = Joi.array()
  .items(PlacemarkResponseSpec)
  .label("PlacemarkArray");

export const CollectionSpec = Joi.object({
  name: Joi.string().example("Cork Castles").required().min(1),
  placemarks: Joi.array().items(PlacemarkSpec).optional(),
   _id: IdSpec,
  __v: Joi.number(),
})
.label("CollectionSpec");
export const CollectionArraySpec = Joi.array().items(CollectionSpec).label("CollectionArray");

