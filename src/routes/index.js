import { Router } from 'express'
import cartRouter from './api/cart.router.js';
import cookiesRouter from './api/cookie.router.js';
import productsRouter from './api/product.router.js';
import sessionRouter from './api/session.router.js';
import viewRouter from './view/view.router.js';
import usersRouter from './api/users.router.js';
import emailRouter from './api/email.router.js';

const router = Router()

// API
router.use('/api/products', productsRouter)
router.use('/api/carts', cartRouter)
router.use('/api/sessions', sessionRouter)
router.use('/api/users', usersRouter)
router.use('/api/email', emailRouter)

// COOKIE
router.use('/cookie', cookiesRouter)

// VIEW
router.use('', viewRouter)

export default router;
