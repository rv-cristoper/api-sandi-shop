import cartRouter from './cart.router.js';
import productsRouter from './product.router.js';

class RoutesController {
    static createRoutes(app) {
        app.use('/api/products', productsRouter)
        app.use('/api/carts', cartRouter)
    }
}

export default RoutesController;