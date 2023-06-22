import isEmpty from 'is-empty';
import EnumsError from './EnumsError.js'
import getLogger from '../logger.js';

const logger = getLogger();

export default (error, req, res, next) => {
    if (!isEmpty(error.cause)) {
        logger.error("MiddlewareError:", [error.cause])
        switch (error.code) {
            case EnumsError.INVALID_TYPES_ERROR:
                res.status(400).send({ status: 'error', error: error.name, cause: error.cause })
                break;
            case EnumsError.INVALID_PARAM_ERROR:
                res.status(400).send({ status: 'error', error: error.name, cause: error.cause })
                break;
            case EnumsError.DATABASE_ERROR:
                res.status(500).send({ status: 'error', error: error.name, cause: error.cause })
                break;
            default:
                res.send({ status: 'error', error: 'Unhadled error' })
        }
    } else if (!isEmpty(error.url)) {
        const errorDetails = {
            success: false,
            message: 'No cuenta con permisos para acceder a este recurso',
            statusCode: error.statusCode || 500
        }
        logger.error("MiddlewareError:", errorDetails)
        return res.render(error.url, errorDetails);
    } else {
        logger.error("MiddlewareError:", { success: false, message: error.message })
        return res.status(500).send({ success: false, message: error.message })
    }

}