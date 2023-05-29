import mongoose from 'mongoose'
import config from '../config/index.js'

export const initDataBase = async () => {
    try {
        await mongoose.connect(config.mongodbUri)
        console.log('Database connected.')
    } catch (error) {
        console.error('Error to connecto to database', error.message)
    }
}