const Product = require('../models/Product');
const Review = require('../models/Review');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createReview = async (req, res) => {
  const { rating, title, comment, productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No Product with id: ${productId}`);
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

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });

  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: id });

  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${id}`);
  }

  if (req.user.id === review.user || req.user.role === 'admin') {
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

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const toBeDeletedReview = Review.findOne({ _id: id });

  if (!toBeDeletedReview) {
    throw new CustomError.NotFoundError(`No review found with id: ${id}`);
  }

  if (req.user.id === toBeDeletedReview.user || req.user.role === 'admin') {
    await toBeDeletedReview.remove();
    res.status(StatusCodes.OK).json({ msg: 'Review Deleted' });
  } else {
    throw new CustomError.BadRequestError(
      'Not authorized to access this route'
    );
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
