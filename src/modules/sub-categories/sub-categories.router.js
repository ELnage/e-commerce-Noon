import { Router } from "express";
import * as subCategoryController from "./sub-categories.controller.js";
import * as subCategorySchema from "./sub-categories.schema.js";
import {
  errorHandler,
  getDocument,
  multerHost,
  validationMiddleware,
} from "../../middlewares/index.js";
import { extensions } from "../../utils/index.js";
import { SubCategory } from "../../../DB/models/index.js";
const subCategoryRouter = Router();

subCategoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(subCategorySchema.createSubCategorySchema),
  getDocument(SubCategory),
  errorHandler(subCategoryController.createSubCategory)
);

subCategoryRouter.put(
  "/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(subCategorySchema.updateSubCategorySchema),
  getDocument(SubCategory),
  errorHandler(subCategoryController.updateSubCategory)
);

subCategoryRouter.delete(
  "/:_id",
  validationMiddleware(subCategorySchema.deleteSubCategorySchema),
  errorHandler(subCategoryController.deleteSubCategory)
);
subCategoryRouter.get("/", errorHandler(subCategoryController.getSubCategory));
subCategoryRouter.get(
  "/all",
  errorHandler(subCategoryController.getAllSubCategories)
);
export { subCategoryRouter };
