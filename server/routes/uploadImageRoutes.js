import multer from 'multer';
import express from 'express';
import path from 'path';
import Payment from '../models/paymentModel.js'; // Import your Payment model

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB
});

uploadRouter.post('/', upload.single('image'), async (req, res) => {
  console.log(req.file); // Log the uploaded file details

  if (!req.file) {
    console.error('No file uploaded.'); // Log error
    return res.status(400).send({ message: 'No file uploaded.' });
  }
  try {
    // Create a new payment entry in the database
    const newPayment = new Payment({
      paymentMethod: req.body.paymentMethod, // From the form data
      referenceNumber: req.body.referenceNumber, // From the form data
      paymentImage: req.file.filename, // The filename of the uploaded image
    });

    // Save the payment record
    const savedPayment = await newPayment.save();
    console.log('Payment saved:', savedPayment);

    // res.send({
    //   message: 'Payment and image uploaded successfully',
    //   payment: savedPayment, // Optionally return the saved payment
    // });
    res.send({ filename: `uploads/${req.file.filename}` });

  } catch (err) {
    console.error('Error saving payment:', err);
    res.status(500).send({ message: 'Error saving payment.' });
  }
 
});

export default uploadRouter;
