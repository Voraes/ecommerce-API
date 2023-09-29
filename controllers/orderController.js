const Order = require('../models/Order');
const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = 'someRamdomSecretValue';
  return { clientSecret, amount };
};

const createOrder = async (req, res) => {
  const { cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id: ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    orderItems = [...orderItems, singleOrderItem];
    subTotal += item.amount * price;
  }

  const total = tax + shippingFee + subTotal;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    tax,
    shippingFee,
    cartItems: orderItems,
    subTotal,
    total,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.id,
  });

  res.status(StatusCodes.CREATED).json({
    order,
    clientSecret: order.clientSecret,
  });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id: ${id}`);
  }

  if (req.user.id === order.user || req.user.role === 'admin') {
    res.status(StatusCodes.OK).json({ order });
  } else {
    throw new CustomError.BadRequestError(
      'Not authorized to access this route'
    );
  }
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });

  if (!orders) {
    throw new CustomError.NotFoundError('No orders found');
  }

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id: ${id}`);
  }

  if (req.user.id === order.user || req.user.role === 'admin') {
    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
  } else {
    throw new CustomError.BadRequestError(
      'Not authorized to access this route'
    );
  }
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
