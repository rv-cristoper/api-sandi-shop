import mongoose from "mongoose"

const user = new mongoose.Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    age: { type: Number, require: true },
    password: { type: String, require: true },
}, { timestamps: true })

export default mongoose.model('user', user);