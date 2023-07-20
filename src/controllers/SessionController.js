import { createHash, isValidToken, tokenGenerator, tokenGeneratorPass, validatePassword } from '../utils/index.js'
import UserService from '../services/user.service.js'
import MessageController from './MessageController.js'

class SessionController {

    static async current(req, res) {
        try {
            const token = req.cookies.token
            const user = res.locals.user
            if (token) {
                const { _id } = user
                let result = await UserService.getOneDTO(_id)
                return res.status(200).json(result)
            }
            return res.status(404).end()
        } catch (error) {
            res.status(500).send({ status: false, message: 'Error in current' });
        }
    }

    static async login(req, res) {
        let user = JSON.parse(JSON.stringify(res.locals.user))
        const token = tokenGenerator(user);
        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        }).status(200).json({ success: true, token });
        // user.rol = 'Usuario'
        // delete user.password;
        // req.session.user = user
        // res.json({ success: true })
        // try {
        //     const { email, password } = req.body
        //     if (!email || !password) {
        //         throw new Error(JSON.stringify({ detail: 'Todos los campos son obligatorios' }))
        //     }
        //     let user;
        //     if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        //         user = {
        //             first_name: 'adminCoder@coder.com',
        //             rol: 'Admin',
        //             email: 'adminCoder@coder.com'
        //         }
        //     } else {
        //         user = await UserModel.findOne({ email }).catch(err => {
        //             throw new Error(JSON.stringify({ detail: 'Email o password invallido' }))
        //         })
        //         if (isEmpty(user) || user.password !== password) {
        //             throw new Error(JSON.stringify({ detail: 'Email o password invallido' }))
        //         }
        //         user = JSON.parse(JSON.stringify(user))
        //         user.rol = 'Usuario'
        //     }
        //     req.session.user = user
        //     res.json({ success: true })
        // } catch (err) {
        //     return res.status(400).json({
        //         message: 'Error al iniciar sesión',
        //         error: JSON.parse(err.message)
        //     });
        // }
    }

    static async register(req, res) {
        let user = JSON.parse(JSON.stringify(res.locals.user))
        delete user.password
        res.status(200).json(user)
        // try {
        //     const { first_name, last_name, email, age, password } = req.body
        //     if (!first_name || !last_name || !email || !age || !password) {
        //         throw new Error(JSON.stringify({ detail: 'Todos los campos son obligatorios' }))
        //     }
        //     const user = await UserModel.create(req.body).catch(err => {
        //         throw new Error(JSON.stringify({ detail: 'El email ingresado ya existe o algún campo no es válido' }))
        //     })
        //     res.status(200).json(user)
        // } catch (err) {
        //     return res.status(400).json({
        //         message: 'Error al regitrar usuario',
        //         error: JSON.parse(err.message)
        //     });
        // }
    }

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await UserService.getOne({ email });
            const token = tokenGeneratorPass(user);
            console.log(token)
            const sendEmail = await MessageController.mail(email, token);
            if (!sendEmail) throw new Error(JSON.stringify({ detail: 'Ocurrio un error al enviar el correo' }))
            return res.status(200).json({ message: "Correo enviado exitosamente" })
        } catch (error) {
            return res.status(400).json({
                message: 'Error al recuperar contraseña',
                error: JSON.parse(error.message)
            });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { email, password } = req.body;
            console.log({ email, password })
            const user = await UserService.getOne({ email });
            if (validatePassword(password, user)) throw new Error(JSON.stringify({ detail: "El password no puede ser el mismo, por favor intente nuevamente" }));
            const hashedPassword = createHash(password);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({ message: "Se cambio la contraseña exitosamente" })
        } catch (error) {
            return res.status(400).json({
                message: JSON.parse(error.message).detail,
                error: JSON.parse(error.message)
            });
        }
    }

    static async loginGithub(req, res) {
        req.session.user = req.user
        res.redirect('/products')
    }

    static async logout(req, res) {
        try {
            const token = req.cookies.token;
            const decoded = await isValidToken(token);
            await UserService.updateOne(decoded.user._id, { $set: { last_connection: new Date() } })
            res.clearCookie('token').status(200).json('Logout ok!')
        } catch (err) {
            res.status(500).send({ status: 'Logout ERROR', body: err });
        }
        // req.session.destroy(err => {
        //     if (!err) res.send('Logout ok!')
        //     else res.send({ status: 'Logout ERROR', body: err })
        // })
    }

}
export default SessionController