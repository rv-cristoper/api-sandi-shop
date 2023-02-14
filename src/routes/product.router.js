import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';

const productsRouter = Router();

productsRouter.get('', ProductController.getProducts)
productsRouter.get('/:pid', ProductController.getProductById)
productsRouter.post('', ProductController.createProduct)
productsRouter.put('/:pid', ProductController.updateProductById)
productsRouter.delete('/:pid', ProductController.deleteProductById)

export default productsRouter;