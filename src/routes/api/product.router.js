import { Router } from 'express';
import ProductController from '../../controllers/ProductController.js';
import { authJWTRole } from "../../middleware/auth.js";

const productsRouter = Router();

productsRouter
    .get('/mockingproducts', ProductController.getMockingproducts)

    .get('', ProductController.getProducts)
    .get('/:pid', ProductController.getProductById)
    .post('', authJWTRole(['Administrador']), ProductController.createProduct)
    .put('/:pid', authJWTRole(['Administrador']), ProductController.updateProductById)
    .delete('/:pid', authJWTRole(['Administrador']), ProductController.deleteProductById)

export default productsRouter;