import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentMethod: { type: String, required: true },
    referenceNumber: { type: String, required: true },
    paymentImage: { type: String, required: true },
  },
  { timestamps: true } // Correct placement for timestamps
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
