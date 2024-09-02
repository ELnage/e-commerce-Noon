import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const createSubCategorySchema = {
  body: joi.object({
    name: joi.string().required(),
  }),
  query: joi.object({
    categoryId: generalRules.objectId.required(),
  }),
};

export const updateSubCategorySchema = {
  body: joi.object({
    name: joi.string(),
  }),
  params: joi.object({
    _id: generalRules.objectId.required(),
  }),
};

export const deleteSubCategorySchema = {
  params: joi.object({
    _id: generalRules.objectId.required(),
  }),
};
