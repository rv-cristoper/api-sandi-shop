import mongoose from "mongoose"

const user = new mongoose.Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    age: { type: Number, require: true },
    password: { type: String, require: true },
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'cart' },
    role: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },
    documents: {
        type: [
            {
                name: { type: String, },
                reference: { type: String, }
            },
        ],
        default: [],
    },
    last_connection: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.model('user', user);