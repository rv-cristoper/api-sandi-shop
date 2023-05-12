import { Router } from 'express'
import cartRouter from './api/cart.router.js';
import cookiesRouter from './api/cookie.router.js';
import productsRouter from './api/product.router.js';
import sessionRouter from './api/session.router.js';
import viewRouter from './view/view.router.js';

// class RoutesController {
//     static createRoutes(app) {
//         // API
//         app.use('/api/products', productsRouter)
//         app.use('/api/carts', cartRouter)
//         app.use('/api/sessions', sessionRouter)

//         // COOKIE
//         app.use('/cookie', cookiesRouter)

//         // VIEW
//         app.use('', viewRouter)
//     }
// }

// export default RoutesController;

const router = Router()

// API
router.use('/api/products', productsRouter)
router.use('/api/carts', cartRouter)
router.use('/api/sessions', sessionRouter)

// COOKIE
router.use('/cookie', cookiesRouter)

// VIEW
router.use('', viewRouter)

export default router;
