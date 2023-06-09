import mongoose from 'mongoose'
import config from '../config/index.js'
import getLogger from '../utils/logger.js';

const logger = getLogger();

export const initDataBase = async () => {
    try {
        await mongoose.connect(config.mongodbUri)
        logger.debug('Database connected.')
    } catch (error) {
        logger.error('Error to connecto to database', error.message)
    }
}