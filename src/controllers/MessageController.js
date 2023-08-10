import config from "../config/index.js";
import emailService from "../services/email.service.js";
import { templateDeleteProduct } from "../templates/templateDeleteProduct.js";
import { templateDeleteUser } from "../templates/templateDeleteUser.js";
import { templateForgotPass } from "../templates/templateForgotPass.js";
import { templateSuccessfulPurchase } from "../templates/templateSuccessfulPurchase.js";


class MessageController {

    static async mail(email, token) {
        const resetLink = `http://localhost:${config.port}/reset-password?token=${token}`;
        await emailService.sendEmail(
            email,
            "Restablecimiento de contraseña",
            templateForgotPass(resetLink)
        );
        return true
    };

    static async deleteProduct(email, fullName, productName) {
        await emailService.sendEmail(
            email,
            "Eliminación de producto",
            templateDeleteProduct(fullName, productName)
        );
        return true
    };

    static async deleteUser(email, fullName) {
        await emailService.sendEmail(
            email,
            "Usuario eliminado",
            templateDeleteUser(fullName)
        );
        return true
    }

    static async successfulPurchase(email, fullName, code) {
        await emailService.sendEmail(
            email,
            "Orden de compra",
            templateSuccessfulPurchase(fullName, code)
        );
        return true
    }

}

export default MessageController;