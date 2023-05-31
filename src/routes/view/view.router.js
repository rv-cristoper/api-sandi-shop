import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';
import { auth, authJWT, authJWTRole } from '../../middleware/auth.js';
import { session } from '../../middleware/session.js';

const viewRouter = Router();

viewRouter
    .get('', auth, ViewController.home)
    .get('/realtimeproducts', authJWT, ViewController.realtimeproducts)
    .get('/chat', authJWTRole(['Usuario'], 'chat'), ViewController.chat)
    .get('/products', authJWTRole(['Usuario','Administrador'], 'products'), ViewController.getProducts)
    .get('/carts/:cid', authJWTRole(['Usuario'], 'products'), ViewController.getCart)
    .get('/login', session, ViewController.login)
    .get('/register', session, ViewController.register)
    .get('/profile', authJWTRole(['Administrador'], 'profile'), ViewController.profile)

export default viewRouter;