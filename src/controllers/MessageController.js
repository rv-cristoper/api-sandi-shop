import config from "../config/index.js";
import emailService from "../services/email.service.js";
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

}

export default MessageController;