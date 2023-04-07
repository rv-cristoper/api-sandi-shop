import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';
import { auth } from '../../middleware/auth.js';
import { session } from '../../middleware/session.js';

const viewRouter = Router();

viewRouter
    .get('', auth, ViewController.home)
    .get('/realtimeproducts', auth, ViewController.realtimeproducts)
    .get('/chat', ViewController.chat)
    .get('/products', auth, ViewController.getProducts)
    .get('/carts/:cid', auth, ViewController.getCart)
    .get('/login', session, ViewController.login)
    .get('/register', session, ViewController.register)
    .get('/profile', auth, ViewController.profile)

export default viewRouter;