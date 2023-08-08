import { Router } from 'express';
import { authJWTRole } from "../../middleware/auth.js";
import UserController from '../../controllers/UserController.js';

const usersRouter = Router();

usersRouter
    .get('', authJWTRole(['Administrador']), UserController.getAll)
    .put('/premium/:uid', authJWTRole(['Administrador']), UserController.updateRoleById)
    .post('/:id/documents', authJWTRole(['Administrador', 'Usuario', 'Premium']), UserController.uploadDocument)
    .delete('', authJWTRole(['Administrador']), UserController.deleteInactiveUsers)
    .delete('/:id', authJWTRole(['Administrador']), UserController.deleteUserByID)

export default usersRouter;