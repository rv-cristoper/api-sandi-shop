import CartModel from '../dao/models/carts.js';

export default class CartService {
    static get() {
        return CartModel.find();
    }
    static getOne(payload) {
        return CartModel.findOne(payload);
    }
    static getById(id) {
        return CartModel.findById(id);
    }
    static create(payload) {
        return CartModel.create(payload);
    }
    static updateOne(id, payload, extradata = {}) {
        return CartModel.updateOne({ id, ...extradata }, payload);
    }
}