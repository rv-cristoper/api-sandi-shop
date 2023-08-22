import config from "../config/index.js";
import { templatePdf } from "../templates/templatePdf.js";
import MessageController from "./MessageController.js";
import pdf from "html-pdf";

class EmailController {

    static async sendEmail(req, res) {
        try {
            const email = req.body.email;
            const name = req.body.name;
            const archive = req.body.archive;
            const typeAction = req.body.typeAction;
            pdf.create(templatePdf(name)).toFile('archivo.pdf', async function (err, file) {
                if (err) return console.log(err);
                const sendEmail = await MessageController.sendEmaiWithPdf(email, archive, typeAction);
                if (!sendEmail) throw new Error(JSON.stringify({ detail: 'Ocurrió un error al enviar el correo' }))
                return res.json({
                    result: 'Email enviado exitosamente'
                });
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al enviar email',
            });
        };
    }

}

export default EmailController;