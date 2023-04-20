import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import UserModel from '../dao/models/user.js'
import { createHash, validatePassword } from './utils.js'

const initPassport = () => {
    const options = {
        usernameField: 'email',
        passReqToCallback: true,
    }
    passport.use('register', new LocalStrategy(options, async (req, email, password, done) => {
        const {
            body: {
                first_name,
                last_name,
                age,
            }
        } = req

        if (!first_name || !last_name || !age) {
            return done(null, false, { message: 'Todo los campos son obligatorios.' })
        }

        try {
            let user = await UserModel.findOne({ email })
            if (user) {
                return done(null, false, { message: "El email ingresado ya existe o algún campo no es válido." })
            }
            user = await UserModel.create({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
            })

            done(null, user)

        } catch (error) {
            return done(null, false, { message: 'Ocurrió un error al procesar su solicitud.' })
        }
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await UserModel.findOne({ email: username })

            if (!user) {
                return done(null, false, { message: "Email o password invallido." })
            }

            if (!validatePassword(password, user)) {
                return done(null, false, { message: "Email o password invallido." })
            }

            done(null, user)
        } catch (error) {
            return done(null, false, { message: 'Ocurrió un error al procesar su solicitud.' })
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initPassport