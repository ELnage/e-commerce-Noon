import joi from "joi"
import { generalRules } from "../../utils/index.js";



export const createCategorySchema = {
  body: joi.object({
    name: joi.string().required(),
  }),
}

export const updateCategorySchema = {
  body: joi.object({
    name: joi.string(),
  }),
  params: joi.object({
    _id: generalRules.objectId.required(),
  }),
}

export const deleteCategorySchema = {
  params: joi.object({
    _id: generalRules.objectId.required(),
  }),
}
