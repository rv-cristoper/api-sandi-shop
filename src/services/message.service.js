import MessageModel from '../dao/models/message.js';

export default class MessageService {
    static get() {
        return MessageModel.find();
    }
    static getOne(payload) {
        return MessageModel.findOne(payload);
    }
    static getById(id) {
        return MessageModel.findById(id);
    }
    static create(payload) {
        return MessageModel.create(payload);
    }
    static updateOne(id, payload, extradata = {}) {
        return MessageModel.updateOne({ id, ...extradata }, payload);
    }
}