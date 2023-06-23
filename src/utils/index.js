import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import config from '../config/index.js'
import getLogger from './logger.js'

const logger = getLogger();

export const tokenGenerator = (user) => {
    console.log(user)
    const role = {
        'user': 'Usuario',
        'admin': 'Administrador',
        'premium': 'Premium'
    }
    const payload = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: role[user.role] || 'Usuario',
    }
    const token = jsonwebtoken.sign(payload, config.secretKey, { expiresIn: '24h' })
    return token
}

export const tokenGeneratorPass = (user) => {
    console.log(user)
    const role = {
        'user': 'Usuario',
        'admin': 'Administrador',
        'premium': 'Premium'
    }
    const payload = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: role[user.role] || 'Usuario',
    }
    const token = jsonwebtoken.sign(payload, config.secretKey, { expiresIn: '1h' })
    return token
  };

export const isValidToken = (token) => {
    return new Promise((resolve) => {
        jsonwebtoken.verify(token, config.secretKey, (error, payload) => {
            if (error) {
                // console.log('err', error)
                logger.warning("isValidToken: ", error)
                return resolve({ status: false })
            }
            return resolve({ status: true, user: payload })
        })
    })
}

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