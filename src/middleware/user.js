import isEmpty from "is-empty";
import UserService from "../services/user.service.js";
import requiredFieldsIdentifier from "../lib/requiredFieldsIdentifier.js";
import allowedFieldsIdentifier from "../lib/allowedFieldsIdentifier.js";

export const validForgotPassword = async (req, res, next) => {
    try {
        let error = {};
        const productData = req.body;
        const requiredFields = ["email"];

        error = requiredFieldsIdentifier(requiredFields, productData);
        const allowed = allowedFieldsIdentifier(requiredFields, productData);
        error = { ...error, ...allowed };

        if (!isEmpty(error)) throw new Error(JSON.stringify(error));

        const user = await UserService.getOne({email: req.body.email});
        if (isEmpty(user)) throw new Error(`No se encontró un usuario con el email: ${req.body.email}`);
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};