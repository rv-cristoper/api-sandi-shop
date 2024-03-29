import { isValidToken } from "../utils/index.js";
import passport from 'passport'
import Exception from '../utils/errors/exception.js'

export const auth = (req, res, next) => {
    if (req.cookies.token) {
        return next()
    }
    return res.redirect('/login')
}

export const authJWT = async (req, res, next) => {
    try {
        if (req.cookies.token) {
            const token = req.cookies.token;
            const decoded = await isValidToken(token);
            if (decoded.status) {
                res.locals.user = decoded.user;
                return next()
            }
            return res.redirect('/login')
        }
        return res.redirect('/login')
    } catch (error) {
        res.redirect("/login");
    }
};

export const authJWTRole = (roles, url = '') => (req, res, next) => {
    passport.authenticate('jwt', function (error, user, info) {
        if (error) {
            return next(error)
        }
        const userData = JSON.stringify({user: `${user.first_name} ${user.last_name}`, email: user.email});
        if (!user) {
            return next(new Exception(`Unauthorized ${!userData ? userData : ''}`, 401, url))
        }
        if (!roles.includes(user.role)) {
            return next(new Exception(`Forbidden ${userData}`, 403, url))
        }
        if (user.role === 'Usuario' && req.params.id && req.params.id !== user._id) {
            return next(new Exception(`Forbiddens ${userData}`, 403, url))
        }
        res.locals.user = user
        next()
    })(req, res, next)
}