import UserService from '../services/user.service.js';
import multer from "multer";
import path from "path";
import fs from "fs";
import __dirname from '../utils/index.js';

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
        folder,
        id
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

    static async uploadDocument(req, res) {
        try {
          const { id } = req.params;
          const { type } = req.query;
          upload.array("files")(req, res, async (err) => {
            if (err) {
              throw new Error(err.message);
            }
            const fileType = getFiletype(type);
            // Obtén el documento existente del usuario
            let user = await UserService.getById(id).catch(() => {
              throw new Error(JSON.stringify({ detail: 'El usuario no fue encontrado' }))
            })
      
            // // Verifica si el tipo de archivo ya está agregado en el array de documentos
            // const documentExists = user.documents.find((doc) => doc.name === fileType.name);
      
            // // Si no existe, agrégalo al array de documentos
            // if (!documentExists) {
            //   user.documents.push(fileType);
            // } else if (fileType.name !== documentExists.name) {
            //   // Si existe pero es de un tipo diferente, agrega el nuevo tipo al array
            //   user.documents.push(fileType);
            // } else{
            //   return res.json({
            //     message: "Ya se cargo un archivo para esa opción",
            //   });
            // }
      
            // // Actualiza el documento en la base de datos
            // const updatedUser = await UsersService.updateUserDoc(id, user.documents);
      
            // return res.status(200).json({
            //   message: "Documentos subidos exitosamente",
            //   user: updatedUser,
            // });
            // return res.status(200).json({
            //     message: "Documentos subidos exitosamente",
            // });
          });
        } catch (err) {
          return res.status(400).json({
            message: "Error al subir los documentos",
            error: err.message,
          });
        }
      }

}

// Función auxiliar para obtener el tipo del archivo
function getFiletype(type) {
    switch (type) {
      case "profiles":
        return {
          "name": "profile",
        };
      case "products":
        return {
          "name": "product",
        };
      default:
        return {
          "name": "document",
        };
    }
}

export default UserController;