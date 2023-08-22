import { Router } from 'express';
import EmailController from '../../controllers/EmailControler.js';

const emailRouter = Router();

emailRouter
    .post('', EmailController.sendEmail)

export default emailRouter;