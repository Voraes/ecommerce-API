import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/authentication';
const Product = require('../models/Product').default;
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors';
import path from 'path';
import Review from '../models/Review';
import {
  getAverageRatingForProduct,
  getNumOfReviews,
} from '../utils/productUtils';
import { UploadedFile } from 'express-fileupload';

export const createProduct = async (req: CustomRequest, res: Response) => {
  const {
    name,
    price,
    description,
    image,
    category,
    company,
    colors,
    featured,
    freeShipping,
    inventory,
    averateRating,
  } = req.body;

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  const product = await Product.create({
    name,
    price,
    description,
    image,
    category,
    company,
    colors,
    featured,
    freeShipping,
    inventory,
    averateRating,
    user: req.user.id,
  });

  res.status(StatusCodes.CREATED).json({ product });
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${id}`);
  }

  const averageRating = await getAverageRatingForProduct(id);
  const numOfReviews = await getNumOfReviews(id);
  res.status(StatusCodes.OK).json({ product, averageRating, numOfReviews });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    price,
    description,
    image,
    category,
    company,
    colors,
    featured,
    freeShipping,
    inventory,
    averateRating,
  } = req.body;

  const product = await Product.findOneAndUpdate(
    { _id: id },
    {
      name,
      price,
      description,
      image,
      category,
      company,
      colors,
      featured,
      freeShipping,
      inventory,
      averateRating,
    },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${id}`);
  }

  const averageRating = await getAverageRatingForProduct(id);
  const numOfReviews = await getNumOfReviews(id);
  res.status(StatusCodes.OK).json({ product, averageRating, numOfReviews });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const toBeDeletedProduct = Product.findOne({ _id: id });

  if (!toBeDeletedProduct) {
    throw new CustomError.NotFoundError(`No product with id: ${id}`);
  }

  await Review.deleteMany({ product: id });
  await toBeDeletedProduct.remove();

  res.status(StatusCodes.OK).json({ msg: 'Product deleted' });
};

export const uploadImage = async (req: CustomRequest, res: Response) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No Image Uploaded');
  }

  const productImage: UploadedFile | UploadedFile[] = req.files.image;

  if (Array.isArray(productImage)) {
    throw new CustomError.BadRequestError('Please only upload one image');
  }

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please Upload image smaller than 1MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  res
    .status(StatusCodes.OK)
    .json({ imagePath: `/uploads/${productImage.name}` });
};
