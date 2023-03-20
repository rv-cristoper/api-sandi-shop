import mongoose from "mongoose"

const product = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    price: { type: Number, require: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, require: true },
    category: { type: String, require: true },
    id: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('product', product)