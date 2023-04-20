import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import bcrypt from 'bcrypt'

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const validatePassword = (password, user) => {
    return bcrypt.compareSync(password, user.password)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const uploader = multer({ storage });
export default __dirname