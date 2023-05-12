import UserModel from '../dao/models/user.js';

export default class UserService {
    static get() {
        return UserModel.find();
    }
    static getOne(payload) {
        return UserModel.findOne(payload);
    }
    static getById(id) {
        return UserModel.findById(id);
    }
    static create(payload) {
        return UserModel.create(payload);
    }
}