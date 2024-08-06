import { nanoid } from "nanoid";
import slugify from "slugify";
import {
  ErrorHandel,
  cloudinaryConfig,
  uploadFileToHost,
} from "../../utils/index.js";
import { Brand, SubCategory } from "../../../DB/models/index.js";
/**
 * @api {post} /brands/create  Create a brand
 */
export const createBrand = async (req, res, next) => {
  // check if the category and subcategory are exist
  const { category, subCategory } = req.query;

  const isSubcategoryExist = await SubCategory.findOne({
    _id: subCategory,
    categoryId: category,
  }).populate("categoryId");

  if (!isSubcategoryExist) {
    return next(new ErrorHandel("Subcategory not found", 404));
  }
  const { name } = req.body;
  const brandExist = await Brand.findOne({
    name: name,
    categoryId: category,
    subCategoryId: subCategory,
  });
  if (brandExist) {
    return next(new ErrorHandel("Brand already exist", 400));
  }
  // Generating brand slug
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
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${isSubcategoryExist.categoryId.customId}/SubCategories/${isSubcategoryExist.customId}/Brands/${customId}`,
  });

  const brand = {
    name,
    slug,
    logo: {
      secure_url,
      public_id,
    },
    customId,
    categoryId: isSubcategoryExist.categoryId._id,
    subCategoryId: isSubcategoryExist._id,
  };
  // create the brand in db
  const newBrand = await Brand.create(brand);
  // send the response
  res.status(201).json({
    message: "Brand created successfully",
    data: newBrand,
  });
};

/**
 * @api {PUT} /sub-categories/update/:_id  Update a category
 */
export const updateBrand = async (req, res, next) => {
  // get the sub-category id
  const { _id } = req.params;

  // destructuring the request body
  const { name } = req.body;

  // find the sub-category by id
  const brand = await Brand.findById(_id)
    .populate("categoryId")
    .populate("subCategoryId");
  if (!brand) {
    return next(new ErrorClass("subCategory not found", 404));
  }

  // Update name and slug
  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
    brand.name = name;
    brand.slug = slug;
  }

  if (req.file) {
    const splitedPublicId = brand.logo.public_id.split(`${brand.customId}/`)[1];
    const { secure_url } = await uploadFileToHost({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`,
      publicId: splitedPublicId,
    });
    brand.logo.secure_url = secure_url;
  }

  // save changes in db
  await brand.save();

  res.status(200).json({
    message: "SubCategory updated successfully",
    data: brand,
  });
};

/**
 * @api {DELETE} /sub-categories/delete/:_id  Delete a category
 */
export const deleteBrand = async (req, res, next) => {
  // get the sub-category id
  const { _id } = req.params;

  // find the sub-category by id
  const brand = await Brand.findByIdAndDelete(_id)
    .populate("categoryId")
    .populate("subCategoryId");
  if (!brand) {
    return next(new ErrorClass("brand not found", 404));
  }
  // delete the related image from cloudinary
  const brandPath = `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(brandPath);
  await cloudinaryConfig().api.delete_folder(brandPath);

  /**
   * @todo  delete the related products from db
   */
  res.status(200).json({
    message: "brand deleted successfully",
  });
};

/**
 * @api {GET} /sub-categories Get category by name or id or slug
 */
export const getBrand = async (req, res, next) => {
  const { id, name, slug } = req.query;
  const queryFilter = {};

  // check if the query params are present
  let brand;
  if (id) brand = await Brand.findById(id);

  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;

  if (name || slug) brand = await Brand.find(queryFilter);
  // find the brand
  if (!id && !name && !slug) {
    return next(new ErrorHandel("Please provide id or name or slug", 404));
  }
  if (!brand) {
    return next(new ErrorHandel("brand not found", 404));
  }

  res.status(200).json({
    message: "brand found",
    data: brand,
  });
};

export const getAllBrands = async (req, res, next) => {
  const {name , category , subCategory} = req.query
  const queryFilter = {}
  if(name) queryFilter.name = name
  if(category) queryFilter.categoryId = category
  if(subCategory) queryFilter.subCategoryId = subCategory
  const brands = await Brand.find(queryFilter); // ToDo : add pagination products
  res.status(200).json({
    data: brands,
  });
}

