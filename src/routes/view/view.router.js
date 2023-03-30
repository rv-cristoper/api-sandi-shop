import { Router } from 'express';
import ViewController from '../../controllers/ViewController.js';

const viewRouter = Router();

viewRouter
    .get('', ViewController.home)
    .get('/realtimeproducts', ViewController.realtimeproducts)
    .get('/chat', ViewController.chat)
    .get('/products', ViewController.getProducts)

export default viewRouter;