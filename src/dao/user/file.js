export default class User {

    constructor() {
        this.users = [
            {
                "_id": "645065f411d7a61c9fe3e73f",
                "first_name": "Cristoper Jhanfranco",
                "last_name": "Runco Contreras",
                "email": "jhanfranco01@gmail.com",
                "age": 26,
                "role": "user",
            }
        ]
    }
    get() {
        return this.users
    }


    getById(id) {
        return this.users.find(user => String(user._id) === '645065f411d7a61c9fe3e73f')
    }

    // create(data) {
    //     const user = { ...data, id: this.users.length + 1 }
    //     this.users.push(user)
    //     return user
    // }

    // updateById(id, data) {
    //     const index = this.users.findIndex(user => String(user.id) === id)
    //     this.users[index] = { ...data, id }
    //     return this.users[index]
    // }

    // deleteById(id) {
    //     const index = this.users.findIndex(user => String(user.id) === id)
    //     const result = this.users.splice(index, 1)
    //     return result
    // }

}