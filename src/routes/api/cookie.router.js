import { Router } from 'express';
import CookieController from '../../controllers/CookieController.js';

const cookiesRouter = Router();

cookiesRouter
    .get('/setCookie', CookieController.setCookie)
    .get('/getCookie', CookieController.getCookie)
    .get('/deleteCookie', CookieController.deleteCookie)

export default cookiesRouter;