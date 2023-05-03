import { isValidToken } from "../config/utils.js";
import passport from 'passport'
import Exception from '../config/exception.js'

export const auth = (req, res, next) => {
    // if (req.session.user) {
    //     return next()
    // }
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
        if (!user) {
            return next(new Exception('Unauthorized', 401, url))
        }
        if (!roles.includes(user.role)) {
            return next(new Exception('Forbidden', 403, url))
        }
        if (user.role === 'Usuario' && req.params.id && req.params.id !== user.id) {
            return next(new Exception('Forbiddens', 403, url))
        }
        res.locals.user = user
        next()
    })(req, res, next)
}