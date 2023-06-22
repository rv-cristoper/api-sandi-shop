import isEmpty from 'is-empty';
import CommonsUtils from '../utils/commons.js';
import ProductService from '../services/product.service.js';
import requiredFieldsIdentifier from '../lib/requiredFieldsIdentifier.js';
import allowedFieldsIdentifier from '../lib/allowedFieldsIdentifier.js';
import generateProduct from '../lib/generateProduct.js';
import getLogger from '../utils/logger.js';
import { isValidToken } from '../utils/index.js';
import UserService from '../services/user.service.js';

class UserController {

    static async updateRoleById(req, res) {
        try {
            const { uid } = req.params;
            const response = await UserService.getById(uid).catch(() => {
                throw new Error(JSON.stringify({ detail: 'El usuario no fue encontrado' }))
            })
            const roles = {
                'user': 'premium',
                'premium': 'user'
            }
            await UserService.updateOne(uid, { $set: { role: roles[response.role] } })
            return res.json({
                message: 'El rol del usuario fue actualizado exitosamente'
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al actualizar el rol del usuario',
                error: JSON.parse(err.message)
            });
        };
    }

}

export default UserController;