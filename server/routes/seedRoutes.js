import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js'
import User from '../models/userModel.js';
import Customize from '../models/customizeModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) =>{
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(data.products);
    await User.deleteMany({});
    const createdUsers = await User.insertMany(data.users);
    await Customize.deleteMany({});
    const createdCustomize = await Customize.insertMany(data.custom);
    res.send({ createdProducts, createdUsers, createdCustomize })
});
export default seedRouter;
//depracated: remove(). it is now deleteMany( )