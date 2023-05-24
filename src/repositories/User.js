import UserDTO from '../dto/User.js'

export default class Contact {
    constructor(dao) {
        this.dao = dao
    }

    get() {
        return this.dao.get()
    }

    async getById (id) {
        const response = await this.dao.getById(id)
        const userInfo = new UserDTO(response)
        return userInfo
    }

    // create(data) {
    //     const constactDto = new ContactDTO(data)
    //     return this.dao.create(constactDto)
    // }

    // updateById(id, data) {
    //     const constactDto = new ContactDTO(data)
    //     return this.dao.updateById(id, constactDto)
    // }

    // deleteById(id) {
    //     return this.dao.deleteById(id)
    // }
}