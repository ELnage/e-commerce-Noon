import { Category, SubCategory, Brand, Product } from "../../../DB/models/index.js";
import { nanoid } from "nanoid";
import { ErrorHandel, cloudinaryConfig } from "../../utils/index.js";
import slugify from "slugify";

/**
 * @api {post} / create category
 * @description create category
 */
export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true, replacement: "_" });

  // image
  if (!req.file) {
    return next(new ErrorHandel("image is required", 400));
  }

  // upload the image to cloudinary
  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${customId}`,
    }
  );

  const newCategory = {
    name,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
  };

  const createdCategory = await Category.create(newCategory);
  res.status(201).json({
    message: "category created",
    createdCategory,
  });
};

/**
 * @api {PUT} /categories/update/:_id  Update a category
 */
export const updateCategory = async (req, res, next) => {
  // get the category id
  const { _id } = req.params;
  // find the category by id
  const category = await Category.findById(_id);
  if (!category) {
    return next(new ErrorHandel("Category not found", 404));
  }
  // name of the category
  const { name } = req.body;

  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });

    category.name = name;
    category.slug = slug;
  }

  //Image
  if (req.file) {
    const splitedPublicId = category.Images.public_id.split(
      `${category.customId}/`
    )[1];

    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`,
        public_id: splitedPublicId,
      }
    );
    category.Images.secure_url = secure_url;
  }

  // save the category with the new changes
  await category.save();

  res.status(200).json({
    message: "Category updated successfully",
    data: category,
  });
};

/**
 * @api {GET} /categories Get category by name or id or slug
 */
export const getCategory = async (req, res, next) => {
  const { id, name, slug } = req.query;
  const queryFilter = {};

  // check if the query params are present
  if (id) queryFilter._id = id;
  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;

  // find the category
  const category = await Category.findOne(queryFilter);

  if (!category) {
    return next(new ErrorHandel("Category not found", 404));
  }

  res.status(200).json({
    message: "Category found",
    data: category,
  });
};

export const deleteCategory = async (req, res, next) => {
  const { _id } = req.params;
  const category = await Category.findByIdAndDelete(_id);
  if (!category) {
    return next(new ErrorHandel("Category not found", 404));
  }
  const categoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${category?.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath);
  await cloudinaryConfig().api.delete_folder(categoryPath);

  // ToDo : delete data related to this category
  await SubCategory.deleteMany({ categoryId: category._id });
  await Brand.deleteMany({ categoryId: category._id });
  await Product.deleteMany({ categoryId: category._id });
  // send the response
  res.status(200).json({
    message: "Category deleted successfully",
    data: category,
  });
};

export const getAllCategories = async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    message: "Categories found",
    data: categories,
  });
};
