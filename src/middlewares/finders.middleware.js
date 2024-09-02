import { ErrorHandel } from "../utils/index.js";

export const getDocument = (model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    if (name) {
      const document = await model.findOne({ name });
      if (document) next(new ErrorHandel("this name already exist", 400));
    }
    next();
  };
};


/**
 *
 * @param {Mongoose.model} model - Mongoose model e.g Brand, Category, SubCategory,..
 * @returns {Function} - Middleware function to check if the document exist
 * @description - Check if the document exist in the database with the given ids
 */
export const checkIfIdsExit = (model) => {
  return async (req, res, next) => {
    const { category, subCategory, brand } = req.query;
    // Ids check
    const document = await model
      .findOne({
        _id: brand,
        categoryId: category,
        subCategoryId: subCategory,
      })
      .populate([
        { path: "categoryId", select: "customId" },
        { path: "subCategoryId", select: "customId" },
      ]);
    if (!document)
      return next(
        new ErrorHandel(`${model.modelName} is not found`, 404 )
      );

    req.document = document;
    next();
  };
}; 
