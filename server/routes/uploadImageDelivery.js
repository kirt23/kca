// import multer from 'multer';
// import express from 'express';
// import { updateOrderToDelivered } from './orderRoutes.js'; // Your controller for delivery update

// const uploadRouter = express.Router();

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/proofOfDelivery/'); // Ensure this folder exists
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB
// });

// // Middleware to check for file types if necessary
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Not an image! Please upload an image.'), false);
//   }
// };

// uploadRouter.put('/:id/deliver', upload.single('image'), async (req, res) => {
//   try {
//     await updateOrderToDelivered(req, res);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default uploadRouter;
