import UserModel from '../dao/models/user.js';
import { userRepository } from '../repositories/index.js'

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
    static getOneDTO(id) {
        return userRepository.getById(id);
    }
    static updateOne(id, payload, extradata = {}) {
        return UserModel.updateOne({ _id: id, ...extradata }, payload);
    }
}