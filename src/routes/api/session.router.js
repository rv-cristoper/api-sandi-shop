import { Router } from "express";
import SessionController from "../../controllers/SessionController.js";

const sessionRouter = Router();

sessionRouter
    .post('/login', SessionController.login)
    .post('/register', SessionController.register)
    .get('/logout', SessionController.logout)

export default sessionRouter;
