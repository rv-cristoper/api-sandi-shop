import config from "../config/index.js";
import emailService from "../services/email.service.js";
import { plantillaDeleteProduct } from "./plantillaDeleteProduct.js";
import { plantillaDeleteUser } from "./plantillaDeleteUser.js";
import { plantillaForgotPass } from "./plantillaForgotPass.js";


class MessageController {

    static async mail(email, token) {
        const resetLink = `http://localhost:${config.port}/reset-password?token=${token}`;
        await emailService.sendEmail(
            email,
            "Restablecimiento de contraseña",
            plantillaForgotPass(resetLink)
        );
        return true
    };

    static async deleteProduct(email, fullName, productName) {
        await emailService.sendEmail(
            email,
            "Eliminación de producto",
            plantillaDeleteProduct(fullName, productName)
        );
        return true
    };

    static async deleteUser(email, fullName) {
        await emailService.sendEmail(
            email,
            "Usuario eliminado",
            plantillaDeleteUser(fullName)
        );
        return true
    }

}

export default MessageController;