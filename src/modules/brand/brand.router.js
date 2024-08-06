import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";
import {
  validationMiddleware,
  errorHandler,
  multerHost,
} from "../../middlewares/index.js";
import { extensions } from "../../utils/index.js";
const brandRouter = Router();
brandRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(brandSchema.createBrandSchema),
  errorHandler(brandController.createBrand)
);

brandRouter.put(
  "/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(brandSchema.updateBrandSchema),
  errorHandler(brandController.updateBrand)
);

brandRouter.delete(
  "/:_id",
  validationMiddleware(brandSchema.updateBrandSchema),
  errorHandler(brandController.deleteBrand)
);

brandRouter.get(
  "/",
  validationMiddleware(brandSchema.getBrandSchema),
  errorHandler(brandController.getBrand)
);

brandRouter.get(
  "/all",
  validationMiddleware(brandSchema.getAllBrandsSchema),
  errorHandler(brandController.getAllBrands)
);
export { brandRouter };
