import UserModel from '../models/user.js';

export default class UserService {
    get() {
        return UserModel.find();
    }
    getOne(payload) {
        return UserModel.findOne(payload);
    }
    getById(id) {
        return UserModel.findById(id);
    }
    create(payload) {
        return UserModel.create(payload);
    }
}