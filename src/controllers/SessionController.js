import { createHash, isValidToken, tokenGenerator, tokenGeneratorPass, validatePassword } from '../utils/index.js'
import UserService from '../services/user.service.js'
import MessageController from './MessageController.js'
import CartService from '../services/cart.service.js'
import isEmpty from 'is-empty'

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
            res.status(500).send({ status: false, message: 'Error en current' });
        }
    }

    static async login(req, res) {
        let user = JSON.parse(JSON.stringify(res.locals.user))
        const cartById = await CartService.getById(user.cart)
        user = {
            ...user,
            cartId: cartById.id
        }
        const token = tokenGenerator(user);
        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        }).status(200).json({ success: true, token });
    }

    static async register(req, res) {
        let user = JSON.parse(JSON.stringify(res.locals.user))
        delete user.password
        res.status(200).json(user)
    }

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await UserService.getOne({ email });
            const token = tokenGeneratorPass(user);
            console.log(token)
            const sendEmail = await MessageController.mail(email, token);
            if (!sendEmail) throw new Error(JSON.stringify({ detail: 'Ocurrió un error al enviar el correo' }))
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
            if(isEmpty(email) || isEmpty(password)) throw new Error(JSON.stringify({ detail: "El email y el password son obligatorios" }))
            const user = await UserService.getOne({ email });
            if (validatePassword(password, user)) throw new Error(JSON.stringify({ detail: "El password no puede ser el mismo, por favor intente nuevamente" }));
            const hashedPassword = createHash(password);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({ message: "Se cambió la contraseña exitosamente" })
        } catch (error) {
            return res.status(400).json({
                message: 'Error al cambiar contraseña',
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
    }

}
export default SessionController