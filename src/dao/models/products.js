import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const product = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    price: { type: Number, require: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, require: true },
    category: { type: String, require: true },
    thumbnails: { type: Array, default: [] },
    id: { type: Number, index: true },
}, { timestamps: true })

product.plugin(mongoosePaginate)

export default mongoose.model('product', product);