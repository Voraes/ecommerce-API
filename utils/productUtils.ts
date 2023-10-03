import Review from '../models/Review';

export const getAverageRatingForProduct = async (productId: string) => {
  const reviews = await Review.find({ product: productId });
  let totalSum = 0;

  for (let i = 0; i < reviews.length; i++) {
    totalSum += reviews[i].rating;
  }

  const averageRating = Math.round(totalSum / reviews.length) || 0;
  return averageRating;
};

export const getNumOfReviews = async (productId: string) => {
  const reviews = await Review.find({ product: productId });
  return reviews.length;
};
