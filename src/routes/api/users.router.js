import { Router } from 'express';
import { authJWTRole } from "../../middleware/auth.js";
import UserController from '../../controllers/UserController.js';

const usersRouter = Router();

usersRouter
    .put('/premium/:uid', authJWTRole(['Administrador']), UserController.updateRoleById)

export default usersRouter;