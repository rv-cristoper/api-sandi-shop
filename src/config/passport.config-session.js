import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { createHash, validatePassword } from './utils.js'
import { Strategy as GithubStrategy } from 'passport-github2'
import UserService from '../services/user.service.js'

const initPassportSession = () => {

    const options = {
        usernameField: 'email',
        passReqToCallback: true,
    }

    const githubOptions = {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK
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
            let user = await UserService.getOne({ email })
            if (user) {
                return done(null, false, { message: "El email ingresado ya existe o algún campo no es válido." })
            }
            user = await UserService.create({
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
            const user = await UserService.getOne({ email: username })

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

    passport.use(
        new GithubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await UserService.getOne({ email: profile._json.email })
                if (!user) {
                    user = await UserService.create({
                        first_name: profile._json.name,
                        last_name: '',
                        email: profile._json.email,
                        age: 18,
                        password: ''
                    })
                }
                done(null, user)
            } catch (error) {
                const message = error.message || "Error al registrar o logear usuario";
                return done(new Error(message), true);
            }
        }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserService.getById(id)
        done(null, user)
    })
}

export default initPassportSession