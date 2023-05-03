import { Router } from "express";
import SessionController from "../../controllers/SessionController.js";
import passport from "passport"
import { authJWTRole } from "../../middleware/auth.js";

const sessionRouter = Router();

const validateRegister = (req, res, next) => {
    passport.authenticate("register", {}, function (err, user, info) {
        if (info) return res.status(400).json({
            message: 'Error al regitrar usuario',
            error: info.message
        });
        res.locals.user = user;
        return next();
    })(req, res, next)
}

const validateLogin = (req, res, next) => {
    passport.authenticate("login", {}, function (err, user, info) {
        if (info) return res.status(400).json({
            message: 'Error al iniciar sesión',
            error: info.message
        });
        res.locals.user = user;
        return next();
    })(req, res, next)
}

sessionRouter
    .post('/login', validateLogin, SessionController.login)
    .post('/register', validateRegister, SessionController.register)
    .get('/logout', SessionController.logout)
    .get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }))
    .get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
        let user = JSON.parse(JSON.stringify(req.user))
        user.role = 'Usuario'
        delete user.password;
        req.session.user = user
        res.redirect('/products')
    })
    .get('/current', authJWTRole(['admin', 'Usuario']), SessionController.current)

export default sessionRouter;
