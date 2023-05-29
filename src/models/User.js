export default class User {
    constructor(user) {
        this.name = user.first_name + ' ' + user.last_name
        this.email = user.email
        this.role = user.role
    }
    static basicInfo(user) {
        return new User(user)
    }
}