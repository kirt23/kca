import mongoose from 'mongoose';

// const orederSchema = new mongoose.Schema (
//     {
//         orderItems: [
//             {
//                 slug: {type: String, required: true},
//                 name: {type: String, required: true},
//                 quantity: {type: String, required: true},
//                 image: {type: String, required: true},
//                 price: {type: Number, required: true},
//                 product: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: 'Product', 
//                     required: true, },
//             },
//         ],
//         shippingAddress: {
//             // firstName:{type: String, required: true},
//             LastName: {type: String, required: true},
//             fullName:{type: String, required: true},
//             address: {type: String, required: true},
//             city: {type: String, required: true},
//             postalCode: {type: Number, required: true},
//             country: {type:String, requried: true}
//         },
//         paymentMethod: {type: String, requried: true},
//         paymentResult: {
//             id: String,
//             status: String, 
//             update_time: String,
//             email_address: String,
//         },
//         itemsPrice: {type: Number, required: true},
//         shippingPrice: {type: Number, required: true},
//         taxPrice: {type: Number, required: true},
//         totalPrice: {type: Number, required: true},
//         user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
//         isPaid: {type: Boolean, default: false},
//         paidAt: {type: Date},
//         isDelivered: {type: Boolean, default: false},
//         deliveredAt: {type: Date},

        
//     },
//     {
//         timestamps: true
//     }
// );
// const Order = mongoose.model('Order', orederSchema);
// export default Order;

const orderSchema = new mongoose.Schema(
    {
      orderItems: [
        {
          slug: { type: String, required: true },
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          image: { type: String, required: true },
          price: { type: Number, required: true },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
        },
      ],
      shippingAddress: {
        LastName: { type: String, required: true },
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: Number, required: true },
        //country: { type: String, required: true },
      },



      
    //   paymentMethod: {
    //     paymentMethodName: { type: String, required: true },
    //     referenceNumber: { type: String, required: true },
    //     paymentImage: { type: String, required: true },
    //   },
    paymentMethodName: { type: String, required: true }, // Changed
    referenceNumber: { type: String, required: true },   // Changed
    paymentImage: { type: String, required: true },      // Changed
      paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
      },
      itemsPrice: { type: Number, required: true },
      shippingPrice: { type: Number, required: true },
      taxPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      isPaid: { type: Boolean, default: false },
      paidAt: { type: Date },
      proofOfDeliveryImage: { type: String }, // Add this line
      isDelivered: { type: Boolean, default: false },
      deliveredAt: { type: Date },
    },
    {
      timestamps: true,
    }
  );
  
  const Order = mongoose.model('Order', orderSchema);
  export default Order;
  