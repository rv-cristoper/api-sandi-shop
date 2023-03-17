import cartRouter from './api/cart.router.js';
import productsRouter from './api/product.router.js';
import viewRouter from './view/view.router.js';

class RoutesController {
    static createRoutes(app) {
        // API
        app.use('/api/products', productsRouter)
        app.use('/api/carts', cartRouter)

        // VIEW
        app.use('', viewRouter)
    }
}

export default RoutesController;