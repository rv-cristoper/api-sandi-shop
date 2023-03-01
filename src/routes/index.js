import cartRouter from './cart.router.js';
import productsRouter from './product.router.js';
import viewRouter from './view.router.js';

class RoutesController {
    static createRoutes(app) {
        app.use('/api/products', productsRouter)
        app.use('/api/carts', cartRouter)
        app.use('', viewRouter)
    }
}

export default RoutesController;