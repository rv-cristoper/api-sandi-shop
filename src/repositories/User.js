import User from '../models/User.js'

export default class Contact {
    constructor(dao) {
        this.dao = dao
    }

    get() {
        return this.dao.get()
    }

    async getById (id) {
        const response = await this.dao.getById(id)
        const userInfo = User.basicInfo(response)
        return userInfo
    }
}