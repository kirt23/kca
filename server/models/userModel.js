import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        middlename: {type: String, required: false},
        lastname: {type: String, required: true},
        suffix: {type: String, required: false},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false, required: true},
        isRider: { type: Boolean, default: false, required: true },
        isCustomer: {type: Boolean, default: false, required: true},
        isVerified: {type: Boolean, default: false},
        verificationToken: {type: String},
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    { timestamps: true}
)
const User = mongoose.model('User', userSchema);
export default User;