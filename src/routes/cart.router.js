import { Router } from 'express';
import CartController from '../controllers/CartController.js';

const cartRouter = Router();

cartRouter.get('/:cid', CartController.getCartById)
cartRouter.post('', CartController.createCart)
cartRouter.post('/:cid/product/:pid', CartController.addProductsToCartById)

export default cartRouter;