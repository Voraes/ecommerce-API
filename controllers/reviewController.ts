import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/authentication';
import Product from '../models/Product';
import Review from '../models/Review';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors';

export const createReview = async (req: CustomRequest, res: Response) => {
  const { rating, title, comment, productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No Product with id: ${productId}`);
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  const userAlreadySubmitted = await Review.findOne({
    user: req.user.id,
    product: productId,
  });

  if (userAlreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already submitted review for this product'
    );
  }

  const review = await Review.create({
    rating,
    title,
    comment,
    user: req.user.id,
    product: isValidProduct,
  });

  res.status(StatusCodes.CREATED).json({ rating, title, comment, productId });
};

export const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await Review.find({})
    .populate({ path: 'product', select: 'name company price' })
    .populate({ path: 'user', select: 'name' });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

export const getSingleReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id })
    .populate({ path: 'product', select: 'name company price' })
    .populate({ path: 'user', select: 'name' });

  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

export const updateReview = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: id });

  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${id}`);
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  if (req.user.id === String(review.user) || req.user.role === 'admin') {
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();

    res.status(StatusCodes.OK).json({ review });
  } else {
    throw new CustomError.BadRequestError(
      'Not authorized to access this route'
    );
  }
};

export const deleteReview = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const toBeDeletedReview = await Review.findOne({ _id: id });

  if (!toBeDeletedReview) {
    throw new CustomError.NotFoundError(`No review found with id: ${id}`);
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  if (
    req.user.id === String(toBeDeletedReview.user) ||
    req.user.role === 'admin'
  ) {
    await toBeDeletedReview.remove();
    res.status(StatusCodes.OK).json({ msg: 'Review Deleted' });
  } else {
    throw new CustomError.BadRequestError(
      'Not authorized to access this route'
    );
  }
};

export const getSingleProductReviews = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviews = await Review.find({ product: id });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
