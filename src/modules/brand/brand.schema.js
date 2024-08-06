import Joi from "joi";
import { generalRules } from "../../utils/index.js";

export const createBrandSchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
  query : Joi.object({
    category : generalRules.objectId.required(),
    subCategory : generalRules.objectId.required()
  })
}


export const updateBrandSchema = {
  body: Joi.object({
    name: Joi.string(),
  }),
  params : Joi.object({
    _id : generalRules.objectId.required()
  })
}



export const deleteBrandSchema = {
  params : Joi.object({
    _id : generalRules.objectId.required()
  })
}

export const getBrandSchema = { 
  query : Joi.object({
    id : generalRules.objectId,
    name : Joi.string(),
    slug : Joi.string()
  })

}


export const getAllBrandsSchema = {
  query: Joi.object({
    name: Joi.string(),
    category: generalRules.objectId,
    subCategory: generalRules.objectId,
  }),
};