import isEmpty from 'is-empty'
import UserModel from '../dao/models/user.js'

class SessionController {

    static async login(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                throw new Error(JSON.stringify({ detail: 'Todos los campos son obligatorios' }))
            }
            let user;
            if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                user = {
                    first_name: 'adminCoder@coder.com',
                    rol: 'Admin',
                    email: 'adminCoder@coder.com'
                }
            } else {
                user = await UserModel.findOne({ email }).catch(err => {
                    throw new Error(JSON.stringify({ detail: 'Email o password invallido' }))
                })
                if (isEmpty(user) || user.password !== password) {
                    throw new Error(JSON.stringify({ detail: 'Email o password invallido' }))
                }
                user = JSON.parse(JSON.stringify(user))
                user.rol = 'Usuario'
            }
            req.session.user = user
            res.json({ success: true })
        } catch (err) {
            return res.status(400).json({
                message: 'Error al iniciar sesión',
                error: JSON.parse(err.message)
            });
        }
    }

    static async register(req, res) {
        try {
            const { first_name, last_name, email, age, password } = req.body
            if (!first_name || !last_name || !email || !age || !password) {
                throw new Error(JSON.stringify({ detail: 'Todos los campos son obligatorios' }))
            }
            const user = await UserModel.create(req.body).catch(err => {
                throw new Error(JSON.stringify({ detail: 'El email ingresado ya existe o algún campo no es válido' }))
            })
            res.status(200).json(user)
        } catch (err) {
            return res.status(400).json({
                message: 'Error al regitrar usuario',
                error: JSON.parse(err.message)
            });
        }
    }

    static async logout(req, res) {
        req.session.destroy(err => {
            if (!err) res.send('Logout ok!')
            else res.send({ status: 'Logout ERROR', body: err })
        })
    }


}
export default SessionController