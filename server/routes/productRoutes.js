import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js'

const productRouter = express.Router();

productRouter.get('/', async (req, res) =>{
    const products = await Product.find();
    res.send(products);
});

productRouter.get('/slug/:slug', async(req, res) =>{ // BACKEND API FOR RETURNING PROD INFO BASE SLUG 
    const product = await Product.findOne({slug:req.params.slug});
    if (product) {
        res.send(product)
    } else {
        res.status(404).send({message: "PRODUCT NOT FOUND"})
    }
})

productRouter.get('/:id', async(req, res) =>{ // BACKEND API FOR RETURNING PROD INFO BASE ON id 
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product)
    } else {
        res.status(404).send({message: "PRODUCT NOT FOUND"})
    }
})
export default productRouter;