import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { createHash, validatePassword } from '../utils/index.js'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import UserService from '../services/user.service.js'
import config from '../config/index.js'
import getLogger from '../utils/logger.js'
import CartService from '../services/cart.service.js'

const logger = getLogger();

function cookieExtractor(req) {
    let token = null
    if (req && req.cookies) {
        token = req.cookies.token
    }
    return token
}

const initPassport = () => {

    const options = {
        usernameField: 'email',
        passReqToCallback: true,
    }

    const githubOptions = {
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackURL: config.githubCallback
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
            const cart = await CartService.create({});
            user = await UserService.create({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart._id
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

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.secretKey,
    }, (payload, done) => {
        return done(null, payload)
    }))
}

export default initPassport