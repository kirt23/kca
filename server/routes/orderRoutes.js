import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth } from '../utils.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js'
import Product from '../models/productModel.js';
import multer from 'multer';

const orderRouter = express.Router(); 

orderRouter.get(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.find().populate('user', 'name');
        res.send(orders);
    })
)

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/proofOfDelivery/');
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB
  });
  
  // Your existing routes...
  
  orderRouter.put(
    '/:id/deliver',
    isAuth,
    upload.single('image'), // Use multer to handle image upload
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        // Replace backslashes with forward slashes in the file path
        order.proofOfDeliveryImage = req.file.path.replace(/\\/g, '/'); // Ensure forward slashes
        await order.save();
        res.send({ message: 'Order is being delivered', order });
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    })
  );
  
// orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
//     const newOrder = new Order({
//         orderItems: req.body.orderItems.map((x)=> ({...x, product: x._id})),
//         shippingAddress: req.body.shippingAddress,
//         paymentMethod: req.body.paymentMethod,
//         itemsPrice: req.body.itemsPrice,
//         shippingPrice: req.body.shippingPrice,
//         taxPrice: req.body.taxPrice,
//         totalPrice: req.body.totalPrice,
//         user: req.user._id
//     });

//     const order = await newOrder.save(); 
//     res.status(201).send({message: 'New Order Created', order});
// }));

orderRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
    //   const newOrder = new Order({
    //     orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
    //     shippingAddress: req.body.shippingAddress,
    //     // paymentMethod: {
    //     //   paymentMethodName: req.body.paymentMethod.paymentMethodName,
    //     //   referenceNumber: req.body.paymentMethod.referenceNumber,
    //     //   paymentImage: req.body.paymentMethod.paymentImage,
    //     // },
    //     paymentMethodName: req.body.paymentMethodName,  // Updated to handle direct fields
    //     referenceNumber: req.body.referenceNumber,      // Updated to handle direct fields
    //     paymentImage: req.body.paymentImage,  
    //     itemsPrice: req.body.itemsPrice,
    //     shippingPrice: req.body.shippingPrice,
    //     taxPrice: req.body.taxPrice,
    //     totalPrice: req.body.totalPrice,
    //     user: req.user._id
    //   });
  const newOrder = new Order({
  orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
  shippingAddress: req.body.shippingAddress,
  paymentMethodName: req.body.paymentMethodName,
  referenceNumber: req.body.referenceNumber,
  paymentImage: req.body.paymentImage, // Make sure this is passed correctly
  itemsPrice: req.body.itemsPrice,
  shippingPrice: req.body.shippingPrice,
  taxPrice: req.body.taxPrice,
  totalPrice: req.body.totalPrice,
  user: req.user._id
});

      const order = await newOrder.save();
      res.status(201).send({ message: 'New Order Created', order });
    })
  );
  orderRouter.put(
    '/:id/confirmPayment',
    isAuth,
    isAdmin, // Only allow admins to confirm payments
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        if (order.isPaid) {
          return res.status(400).send({ message: 'Order is already paid' });
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentReferenceNumber = req.body.referenceNumber;
        //order.paymentImage = req.body.paymentImage;
  
        const updatedOrder = await order.save();
        res.send({ message: 'Payment confirmed', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    })
  );
  

orderRouter.get(
    '/summary',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    numOrders: {$sum: 1},
                    totalSales: {$sum: '$totalPrice'},
                }
            },
        ]);


        const users = await User.aggregate([
            {
                $group: {
                    _id: null,
                    numUsers: {$sum: 1},
                }
            },
        ]);

        const dailyOrders = await Order.aggregate([
            {
                $group: {
                    _id: {$dateToString: {format: '%m-%d-%Y', date: '$createdAt'}},
                    orders: {$sum: 1},
                    sales: {$sum: '$totalPrice'}
                }
            },
            {$sort: {_id: 1}},
        ]);

        const productCategories = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: {$sum: 1}
                }
            },
            
        ]);

        res.send({users, orders, dailyOrders, productCategories}); 
    })
)

orderRouter.get('/mine', isAuth, expressAsyncHandler (async (req, res) => {
    const orders = await Order.find({user: req.user._id});
    res.send(orders);
}));

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order){
        res.send(order);
    }
    else{
        res.status(404).send({message: 'ORDER NOT FOUND'});
    }
}));

orderRouter.put(
    '/:id/deliver',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if(order){
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            await order.save();
            res.send({message: 'ORDER IS BEING DELIVRED'})
        }
        else {
            res.status(404).send({message: 'ORDER NOT FOUND'})
        }
    })
);


orderRouter.put(
    '/:id/pay', isAuth, expressAsyncHandler(async(req, res) =>{
        const order = await Order.findById(req.params.id);
        if(order){
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updateOrder = await order.save();
            res.send({message: 'ORDER PAID', order: updateOrder});
        }
        else {
            res.status(404).send({message: 'ORDER NOT FOUND'});
        }
    })
);

orderRouter.delete(
    '/:id',
    isAuth,
    expressAsyncHandler(async(req, res) =>{
        const order = await Order.findById(req.params.id);
        if(order) {
            await order.deleteOne();
            res.send({message: 'ORDER IS SUCCESSFULLY DELETED'});
        } else{
            res.status(404).send({message: 'ORDER DO NOT EXIST. ERROR'});
        }
    })
)


export default orderRouter;