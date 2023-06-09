import { Router } from 'express';
import ProductController from '../../controllers/ProductController.js';
import { authJWTRole } from "../../middleware/auth.js";
import { validateAddPRoduct } from '../../middleware/product.js';

const productsRouter = Router();

productsRouter
    .get('/loggerTest', authJWTRole(['Administrador', 'Usuario']), ProductController.getLoggerTest)
    .get('/mockingproducts', authJWTRole(['Administrador']), ProductController.getMockingproducts)

    .get('', ProductController.getProducts)
    .get('/:pid', ProductController.getProductById)
    .post('', authJWTRole(['Administrador']), validateAddPRoduct, ProductController.createProduct)
    .put('/:pid', authJWTRole(['Administrador']), ProductController.updateProductById)
    .delete('/:pid', authJWTRole(['Administrador']), ProductController.deleteProductById)

export default productsRouter;