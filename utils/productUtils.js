const Review = require('../models/Review');

const getAverageRatingForProduct = async (productId) => {
  const reviews = await Review.find({ product: productId });
  let totalSum = 0;

  for (i = 0; i < reviews.length; i++) {
    totalSum += reviews[i].rating;
  }

  averageRating = Math.round(totalSum / reviews.length) || 0;
  return averageRating;
};

const getNumOfReviews = async (productId) => {
  const reviews = await Review.find({ product: productId });
  return reviews.length;
};

module.exports = { getAverageRatingForProduct, getNumOfReviews };
