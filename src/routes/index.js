import cartRouter from './api/cart.router.js';
import cookiesRouter from './api/cookie.router.js';
import productsRouter from './api/product.router.js';
import sessionRouter from './api/session.router.js';
import viewRouter from './view/view.router.js';

class RoutesController {
    static createRoutes(app) {
        // API
        app.use('/api/products', productsRouter)
        app.use('/api/carts', cartRouter)
        
        // COOKIE
        app.use('/cookie', cookiesRouter)

        // VIEW
        app.use('', viewRouter)
    }
}

export default RoutesController;