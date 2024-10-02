import express from 'express';
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier'
import { isAuth } from '../utils.js';
import Customize from '../models/customizeModel.js';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';



const upload = multer();

const customRouter = express.Router();

customRouter.get('/', async (req, res) =>{
  const custom = await Customize.find();
  res.send(custom);
});

customRouter.post(
  '/', isAuth, expressAsyncHandler(async (req, res) =>{
    const newCustomize = new Customize({
        name: 'first name' + Date.now(),
        lastname: 'last name' + Date.now(),
        image: ' ',
        images: ' ',
        phoneNum: ' ',
        description: 'item description',
    });
    const custom = await newCustomize.save();
    res.send({message: 'Customization Request Saved', custom})
  })
);

customRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const customId = req.params.id;
    const custom = await Customize.findById(customId);
    if(custom) {
      custom.name = req.body.name;
      custom.image = req.body.image;
      custom.images = req.body.images;
      custom.phoneNum = req.body.phoneNum;
      custom.description = req.body.description;
      await custom.save();
      res.send({message: 'Customized Request Successfully Updated'});
    }
    else {
      res.status(404).send({message: 'Customized Request Error. Error 404'})
    }
  })
);

customRouter.post(
  '/', 
  isAuth, 
  upload.single('file'),
   async (req, res) =>{
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

 
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream  = cloudinary.uploader.upload_stream((error, result) =>{
            if(result) {
              resolve(result);
            }
            else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req);
      res.send(result);
});


customRouter.get('/:id', async(req, res) =>{ 
  const custom = await Customize.findById(req.params.id);
  if (custom) {
      res.send(custom)
  } else {
      res.status(404).send({message: "CUSTOM REQUEST NOT FOUND"})
  }
})

export default customRouter;