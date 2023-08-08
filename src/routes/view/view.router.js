import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';
import { auth, authJWT, authJWTRole } from '../../middleware/auth.js';
import { session } from '../../middleware/session.js';
import { validResetPassword } from '../../middleware/user.js';

const viewRouter = Router();

viewRouter
    .get('', auth, ViewController.home)
    .get('/realtimeproducts', authJWT, ViewController.realtimeproducts)
    .get('/chat', authJWTRole(['Usuario'], 'chat'), ViewController.chat)
    .get('/products', authJWTRole(['Usuario','Administrador', 'Premium'], 'products'), ViewController.getProducts)
    .get('/carts/:cid', authJWTRole(['Usuario', 'Premium'], 'users'), ViewController.getCart)
    .get('/login', session, ViewController.login)
    .get('/register', session, ViewController.register)
    .get('/forgot-password', session, ViewController.forgotPassword)
    .get('/reset-password', session, validResetPassword, ViewController.resetPassword)
    .get('/profile', authJWTRole(['Administrador', 'Usuario','Premium'], 'profile'), ViewController.profile)
    .get('/users', authJWTRole(['Administrador'], 'users'), ViewController.users)

export default viewRouter;