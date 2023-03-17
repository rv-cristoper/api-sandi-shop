import { Router } from 'express';
import ProductController from '../../controllers/ProductController.js';

const productsRouter = Router();

productsRouter
    .get('', ProductController.getProducts)
    .get('/:pid', ProductController.getProductById)
    .post('', ProductController.createProduct)
    .put('/:pid', ProductController.updateProductById)
    .delete('/:pid', ProductController.deleteProductById)

export default productsRouter;