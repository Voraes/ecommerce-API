import Order from '../models/Order';
const Product = require('../models/Product').default;
import CustomError from '../errors';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/authentication';

interface OrderItem {
  amount: number;
  name: String;
  price: number;
  image: String;
  product: any;
}

const fakeStripeAPI = async (amount: number, currency: string) => {
  const clientSecret = 'someRamdomSecretValue';
  return { clientSecret, amount };
};

export const createOrder = async (req: CustomRequest, res: Response) => {
  const { cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  let orderItems: OrderItem[] = [];
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

  const paymentIntent = await fakeStripeAPI(total, 'usd');

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

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

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const getSingleOrder = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id: ${id}`);
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  if (req.user.id === String(order.user) || req.user.role === 'admin') {
    res.status(StatusCodes.OK).json({ order });
  } else {
    throw new CustomError.BadRequestError(
      'Not authorized to access this route'
    );
  }
};

export const getCurrentUserOrders = async (
  req: CustomRequest,
  res: Response
) => {
  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  const orders = await Order.find({ user: req.user.id });

  if (!orders) {
    throw new CustomError.NotFoundError('No orders found');
  }

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const updateOrder = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id: ${id}`);
  }

  if (!req.user) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  if (req.user.id === String(order.user) || req.user.role === 'admin') {
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
