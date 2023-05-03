import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';
import { auth, authJWT, authJWTRole } from '../../middleware/auth.js';
import { session } from '../../middleware/session.js';

const viewRouter = Router();

viewRouter
    .get('', auth, ViewController.home)
    .get('/realtimeproducts', authJWT, ViewController.realtimeproducts)
    .get('/chat', ViewController.chat)
    .get('/products', authJWTRole(['Usuario'], 'products'), ViewController.getProducts)
    .get('/carts/:cid', authJWT, ViewController.getCart)
    .get('/login', session, ViewController.login)
    .get('/register', session, ViewController.register)
    .get('/profile', authJWTRole(['admin'], 'profile'), ViewController.profile)

export default viewRouter;