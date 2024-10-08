import { categoryRouter } from "./modules/category/category.router.js";
import { brandRouter } from "./modules/brand/brand.router.js";
import { subCategoryRouter } from "./modules/sub-categories/sub-categories.router.js";
import { productRouter } from "./modules/Products/products.router.js";

export const mountRoutes = (app) => {
    app.use("/category", categoryRouter);
    app.use("/subcategory", subCategoryRouter);
    app.use('/brand', brandRouter)
    app.use("/product", productRouter);
}