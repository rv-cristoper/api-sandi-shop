export default class User {
    constructor(user) {
        this.name = user.first_name + ' ' + user.last_name
        this.email = user.email
        this.role = user.role
    }
    static basicInfo(user) {
        return new User(user)
    }
    static detailInfo(user) {
        return {
            ...this.basicInfo(user),
            _id: user._id,
            documents: user.documents.map((e) => e.name).toString().replaceAll(',', ', '),
        }
    }
}