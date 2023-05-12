import ProductModel from '../dao/models/products.js';

export default class ProductService {
    static get() {
        return ProductModel.find();
    }
    static getOne(payload) {
        return ProductModel.findOne(payload);
    }
    static getById(id) {
        return ProductModel.findById(id);
    }
    static create(payload) {
        return ProductModel.create(payload);
    }
    static updateOne(id, payload, extradata = {}) {
        return ProductModel.updateOne({ id, ...extradata }, payload);
    }
    static deleteOne(id) {
        return ProductModel.deleteOne({ id });
    }
    static paginate(query, opts) {
        return ProductModel.paginate(query, opts);
    }
}