import { Router } from 'express';
import CartController from '../../controllers/CartController.js';
import { authJWTRole } from '../../middleware/auth.js';

const cartRouter = Router();

cartRouter
    .get('/:cid', CartController.getCartById)
    .post('', CartController.createCart)
    .post('/:cid/product/:pid', authJWTRole(['Usuario']), CartController.addProductsToCartById)
    .delete('/:cid/product/:pid', CartController.deleteProductById)
    .put('/:cid', CartController.updateAllProductsToCartById)
    .put('/:cid/product/:pid', CartController.updateQuantityProductToCartById)
    .delete('/:cid', CartController.deleteAllProductByCartId)
    .post("/:cid/purchase", authJWTRole(['Usuario']), CartController.createOrder)

export default cartRouter;