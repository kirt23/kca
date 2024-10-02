import mongoose from "mongoose";

const customizeSchema = new mongoose.Schema(
    {
        // _id: {type: Number, required: true, unique: true},
        name: {type: String, required: true, unique: true},
        lastname: {type: String, required: true},
        image: {type: String, required: true},
        images: [String],
        phoneNum: {type: Number, required: true},
        description: {type: String, required: true},
    },
    { timestamps: true}
)

const Customize = mongoose.model('Customize', customizeSchema);
export default Customize; 
