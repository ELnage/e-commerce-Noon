import { nanoid } from "nanoid";
import slugify from "slugify";
// models
import { Product } from "../../../DB/models/index.js";
// utils
import {
  calculateProductPrice,
  cloudinaryConfig,
  ErrorHandel,
  uploadFileToHost,} from "../../utils/index.js";

/**
 * @api {post} /products/add  Add Product
 */
export const addProduct = async (req, res, next) => {
  // destructuring the request body
  const { title, overview, specs, price, discountAmount, discountType, stock } =
    req.body;
  // req,files
  if (!req.files.length)
    return next(new ErrorHandel("No images uploaded",  400 ));

  // Ids check
  const brandDocument = req.document;
  // Images section
  // Access the customIds from the brandDocument
  const brandCustomId = brandDocument.customId;
  const catgeoryCustomId = brandDocument.categoryId.customId;
  const subCategoryCustomId = brandDocument.subCategoryId.customId;

  const customId = nanoid(4);
  const folder = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/SubCategories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${customId}`;

  // upload each file to cloudinary
  const URLs = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await uploadFileToHost({
      file: file.path,
      folder,
    });
    URLs.push({ secure_url, public_id });
  }

  // prepare product object
  const productObject = {
    title,
    overview,
    specs: JSON.parse(specs),
    price,
    appliedDiscount: {
      amount: discountAmount,
      type: discountType,
    },
    stock,
    Images: {
      URLs,
      customId,
    },
    categoryId: brandDocument.categoryId._id,
    subCategoryId: brandDocument.subCategoryId._id,
    brandId: brandDocument._id,
  };

  // create in db
  const newProduct = await Product.create(productObject);
  // send the response
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: newProduct,
  });
};

/**
 * @api {put} /products/update/:productId  Update Product
 * @todo Upload images to cloudinary and db
 */
export const updateProduct = async (req, res, next) => {
  // productId from params
  const { productId } = req.params;
  // destructuring the request body
  const {
    title,
    stock,
    overview,
    badge,
    price,
    discountAmount,
    discountType,
    specs,
  } = req.body;
  // check if the product is exist
  const product = await Product.findById(productId);
  console.log(product , title);
  
  if (!product)
    return next(new ErrorHandel("Product not found",  404 ));

  // update the product title and slug
  if (title) {
    product.title = title;
    product.slug = slugify(title, {
      replacement: "_",
      lower: true,
    });
  }
  // update the product stock, overview, badge
  if (stock) product.stock = stock;
  if (overview) product.overview = overview;
  if (badge) product.badge = badge;

  // update the product price and discount
  if (price || discountAmount || discountType) {
    const newPrice = price || product.price;
    const discount = {};
    discount.amount = discountAmount || product.appliedDiscount.amount;
    discount.type = discountType || product.appliedDiscount.type;

    product.appliedPrice = calculateProductPrice(newPrice, discount);

    product.price = newPrice;
    product.appliedDiscount = discount;
  }

  // update the product specs
  if (specs) product.specs = JSON.parse(specs);

  // save the product changes
  await product.save();
  // send the response
  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
};

/**
 *  @api {delete} /products/delete/:productId  Delete Product
 */


export const deleteProduct = async (req, res, next) => {
  // productId from params
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId)
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("brandId");
  // check if the product is exist
  if (!product) return next(new ErrorHandel("Product not found", 404));
  // delete the related image from cloudinary
  const ProductPath = `${process.env.UPLOADS_FOLDER}/Categories/${product.categoryId.customId}/SubCategories/${product.subCategoryId.customId}/Brands/${product.brandId.customId}/Products/${product.Images.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(ProductPath);
  await cloudinaryConfig().api.delete_folder(ProductPath);
  // send the response
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
};



/**
 * @api {get} /products/list  list all Products
 *
 */
export const listProducts = async (req, res, next) => {
  // find all products
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;


  //without paginate plugin

  // const data = await Product.find()
  //   .limit(limit)
  //   .skip(skip)
  //   .select("-Images -specs -categoryId -subCategoryId -brandId");

  const products = await Product.paginate(
    {
    },
    {
      page,
      limit,
      skip,
      select: "-Images --spescs -categoryId -subCategoryId -brandId",
      sort: { appliedPrice: 1 },
    }
  );
  // send the response
  res.status(200).json({
    message: "Products list",
    data: products,
  });
};
