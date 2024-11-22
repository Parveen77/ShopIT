import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/product.js";

// Create new order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user:req?.user?._id,
        userName:req?.user?.name,
    });

    res.status(200).json({
        order,
    });
});


//Get all orders by a user => /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find({user: req.user._id}).populate("user","name email");

    if(!order) {
        return next( new ErrorHandler("No order found with this ID", 404));
    }

    res.status(200).json({
        order,
    });
});

//Get order details by ID => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next( new ErrorHandler("No order found with this ID", 404));
    }

    res.status(200).json({
        order,
    });
});

//Get all orders ADMIN => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find();

    res.status(200).json({
        order,
    });
});

// Update Order - ADMIN  =>  /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("No Order found with this ID", 404));
    }
  
    if (order?.orderStatus === "Delivered") {
      return next(new ErrorHandler("You have already delivered this order", 400));
    }
  
// Update products stock
order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item?.product?.toString());
    if (!product) {
      return next(new ErrorHandler("No Product found with this ID", 404));
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});

//Delete orders ADMIN => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorHandler("No Product found with this ID", 404));
      };

    await order.deleteOne()
      
    res.status(200).json({
        success: true,
    });
});

