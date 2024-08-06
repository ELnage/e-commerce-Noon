import { Router } from "express";
import * as categoryController from "./category.controller.js";
import * as  categorySchema from "./category.schema.js";
import {errorHandler,multerHost,getDocument, validationMiddleware} from "../../middlewares/index.js";
import { extensions } from "../../utils/index.js";
import { Category } from "../../../DB/models/category.model.js";

const categoryRouter = Router();

categoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(categorySchema.createCategorySchema),
  getDocument(Category),
  errorHandler(categoryController.createCategory)
);

categoryRouter.get("/", errorHandler(categoryController.getCategory));


categoryRouter.put(
  "/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(categorySchema.updateCategorySchema),
  getDocument(Category),
  errorHandler(categoryController.updateCategory)
);


categoryRouter.delete(
  "/:_id",
  validationMiddleware(categorySchema.deleteCategorySchema),
  errorHandler(categoryController.deleteCategory)
);

categoryRouter.get("/all", errorHandler(categoryController.getAllCategories));

export { categoryRouter };
