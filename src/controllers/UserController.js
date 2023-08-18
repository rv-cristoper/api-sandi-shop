import UserService from '../services/user.service.js';
import multer from "multer";
import path from "path";
import fs from "fs";
import __dirname from '../utils/index.js';
import User from '../models/User.js';
import moment from 'moment';
import MessageController from './MessageController.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id } = req.params;
    const { type } = req.query;
    let folder;
    if (type === "profile") {
      folder = "profiles";
    } else if (type === "product") {
      folder = "products";
    } else {
      folder = "documents";
    }
    const destinationFolder = path.join(
      __dirname,
      "../../public/uploads",
      folder
    );

    fs.mkdirSync(destinationFolder, { recursive: true });
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}${extension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

class UserController {

  static async getAll(req, res) {
    try {
      let users = await UserService.get();
      users = users.map(e => User.basicInfo(e))
      return res.json({
        users,
        total: users.length
      });
    } catch (err) {
      return res.status(400).json({
        message: 'Error al obtener los usuarios',
        error: err.message
      });
    }
  }

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
      const documentsRequered = [
        "Identificación",
        "Comprobante de domicilio",
        "Comprobante de estado de cuenta",
      ];
      const validateDocuments = documentsRequered.every(documento => response.documents.some(objeto => objeto.name.toLowerCase() === documento.toLowerCase()));
      if (response.role === 'premium' || (response.role === 'user' && validateDocuments)){
        await UserService.updateOne(uid, { $set: { role: roles[response.role] } })
      } else {
        throw new Error(JSON.stringify({ detail: 'El usuario no ha terminado de procesar su documentación.' }))
      }
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

  static async uploadDocument(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query;
      upload.array("files")(req, res, async (err) => {
        if (err) {
          throw new Error(err.message);
        }
        const fileType = getFiletype(type);
        let user = await UserService.getById(id).catch(() => {
          throw new Error(JSON.stringify({ detail: 'El usuario no fue encontrado' }))
        })
        let rejectedDocuments = [];
        req.files.forEach(element => {
          let newName = element.originalname.split('.')[0]
          newName = Buffer.from(newName, 'latin1').toString('utf8')
          const documentExists = user.documents.find(doc => doc.name === newName);
          if (!documentExists) {
            user.documents.push({
              name: newName,
              reference: `/uploads/${fileType}/${element.filename}`
            });
          } else {
            rejectedDocuments.push(newName)
          }
        });
        const updatedUser = await UserService.updateOne(id, { $set: { documents: user.documents } });

        let response = {
          message: "Documentos subidos exitosamente",
          user: updatedUser,
        }
        if (rejectedDocuments) {
          response.rejectedDocuments = JSON.stringify(rejectedDocuments)
        }
        return res.status(200).json(response);
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al subir los documentos",
        error: err.message,
      });
    }
  }

  static async deleteInactiveUsers(req, res) {
    try {
      const days = 2
      const condition = moment().subtract(days, 'days').toDate();
      let users = await UserService.get();
      users = users.filter(e => e.last_connection === null || moment(e.last_connection).toDate() < condition)
      if (!users.length) {
        throw new Error('No hay usuarios inactivos')
      }
      const response = await UserService.deleteMany({ $or: [{ last_connection: { $lte: condition } }, { last_connection: { $exists: false } }] });
      if (!response.deletedCount > 0) {
        throw new Error('No se pudieron eliminar los usuarios inactivos')
      }
      for (const e of users) {
        const userData = User.basicInfo(e)
        await MessageController.deleteUser(userData.email, `${userData.name}`);
      }
      return res.json({
        message: 'Los usuarios inactivos fueron eliminados exitosamente',
      });
    } catch (err) {
      return res.status(400).json({
        message: 'Error al eliminar los usuarios inactivos',
        error: err.message
      });
    }
  }

  static async deleteUserByID(req, res) {
    try {
      const { id } = req.params;
      await UserService.getById(id).catch(() => {
        throw new Error('El usuario no fue encontrado')
      })
      await UserService.deleteOne({ _id: id });
      return res.json({
        message: `El usuario fue eliminado exitosamente`
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al eliminar el usuario",
        error: err.message,
      });
    }
  }

}

// Función auxiliar para obtener el tipo del archivo
function getFiletype(type) {
  switch (type) {
    case "profile":
      return "profiles";
    case "product":
      return "products";
    default:
      return "documents";
  }
}

export default UserController;