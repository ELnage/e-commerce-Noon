import slugify from "slugify";
import { Category, SubCategory, Brand, Product } from "../../../DB/models/index.js";
import {
  cloudinaryConfig,
  ErrorHandel,
  uploadFileToHost,
} from "../../utils/index.js";
import { nanoid } from "nanoid";

/**
 * @api {POST} /sub-categories/create  create a  new subCategory
 */
export const createSubCategory = async (req, res, next) => {
  // find the category by id
  const { categoryId } = req.query;
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new ErrorHandel("Category not found", 404));
  }

  // Generating category slug
  const { name } = req.body;

  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });

  // Image
  if (!req.file) {
    return next(new ErrorClass("Please upload an image", 400));
  }
  const customId = nanoid(4);
  const { secure_url, public_id } = await uploadFileToHost({
    file: req.file.path,
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`,
  });
  const subCategory = {
    name,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
    categoryId: category._id,
  };

  // create the category in db
  const newSubCategory = await SubCategory.create(subCategory);

  // send the response
  res.status(201).json({
    message: "Sub-Category created successfully",
    data: newSubCategory,
  });
};

/**
 * @api {PUT} /sub-categories/update/:_id  Update a category
 */
export const updateSubCategory = async (req, res, next) => {
  // get the sub-category id
  const { _id } = req.params;

  const { name } = req.body;

  // find the sub-category by id
  const subCategory = await SubCategory.findById(_id).populate("categoryId");
  if (!subCategory) {
    return next(new ErrorHandel("subCategory not found", 404));
  }

  // Update name and slug
  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
    subCategory.name = name;
    subCategory.slug = slug;
  }

  if (req.file) {
    const splitedPublicId = subCategory.Images.public_id.split(
      `${subCategory.customId}/`
    )[1];
    const { secure_url } = await uploadFileToHost({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/SubCategories/${subCategory.customId}`,
      publicId: splitedPublicId,
    });
    subCategory.Images.secure_url = secure_url;
  }

  // save changes in db
  await subCategory.save();

  res.status(200).json({
    message: "SubCategory updated successfully",
    data: subCategory,
  });
};

/**
 * @api {DELETE} /sub-categories/delete/:_id  Delete a category
 */
export const deleteSubCategory = async (req, res, next) => {
  // get the sub-category id
  const { _id } = req.params;
  console.log(_id);

  // find the sub-category by id
  const subCategory = await SubCategory.findByIdAndDelete(_id).populate(
    "categoryId"
  );
  // if not found return error
  if (!subCategory) {
    return next(new ErrorHandel("subCategory not found", 404));
  }
  // delete the related image from cloudinary
  const subcategoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/SubCategories/${subCategory.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(subcategoryPath);
  await cloudinaryConfig().api.delete_folder(subcategoryPath);

  /**
   * @todo  delete the related brands , products from db
   */
  await Brand.deleteMany({ subCategoryId: subCategory._id });
  await Product.deleteMany({ subCategoryId: subCategory._id });
  res.status(200).json({
    message: "SubCategory deleted successfully",
    data: subCategory,
  });
};

/**
 * @api {GET} /sub-categories Get category by name or id or slug
 */
export const getSubCategory = async (req, res, next) => {
  const { id, name, slug } = req.query;
  const queryFilter = {};

  // check if the query params are present
  if (id) queryFilter._id = id;
  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;

  // find the category
  const subCategory = await SubCategory.findOne(queryFilter).populate(
    "categoryId"
  );

  if (!subCategory) {
    return next(new ErrorHandel("sub Category not found", 404));
  }

  res.status(200).json({
    data: subCategory,
  });
};

/**
 * @api {GET} /sub-categories Get all categories paginated with it’s brands
 */

export const getAllSubCategories = async (req, res, next) => {
  const subCategories = await SubCategory.find().populate("categoryId"); // ToDo : add pagination brands
  res.status(200).json({
    data: subCategories,
  });
};
