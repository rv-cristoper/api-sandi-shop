import isEmpty from "is-empty";
import UserService from "../services/user.service.js";
import requiredFieldsIdentifier from "../lib/requiredFieldsIdentifier.js";
import allowedFieldsIdentifier from "../lib/allowedFieldsIdentifier.js";
import { isValidToken } from "../utils/index.js";

export const validForgotPassword = async (req, res, next) => {
    try {
        let error = {};
        const productData = req.body;
        const requiredFields = ["email"];

        error = requiredFieldsIdentifier(requiredFields, productData);
        const allowed = allowedFieldsIdentifier(requiredFields, productData);
        error = { ...error, ...allowed };

        if (!isEmpty(error)) throw new Error(JSON.stringify(error));

        const user = await UserService.getOne({ email: req.body.email });
        if (isEmpty(user)) throw new Error(`No se encontró un usuario con el email: ${req.body.email}`);
        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const validResetPassword = async (req, res, next) => {
    try {

        const { token } = req.query;
        const response = await isValidToken(token);
        if(!response.status) throw new Error(`Estas tratando de acceder a una ruta que no se encuentra disponible por el momento, si en caso restableciste tu contraseña prueba intentandolo nuevamente`);
        const user = await UserService.getOne({email:response.user.email});
        res.locals.user = user
        next();

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};