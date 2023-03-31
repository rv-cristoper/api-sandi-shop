import { Router } from 'express';
import CartController from '../../controllers/CartController.js';

const cartRouter = Router();

cartRouter
    .get('/:cid', CartController.getCartById)
    .post('', CartController.createCart)
    .post('/:cid/product/:pid', CartController.addProductsToCartById)
    .delete('/:cid/product/:pid', CartController.deleteProductById)
    .put('/:cid', CartController.updateAllProductsToCartById)
    .put('/:cid/product/:pid', CartController.updateQuantityProductToCartById)
    .delete('/:cid', CartController.deleteAllProductByCartId)

export default cartRouter;