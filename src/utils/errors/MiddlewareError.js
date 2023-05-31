import isEmpty from 'is-empty';
import EnumsError from './EnumsError.js'

export default (error, req, res, next) => {
    console.log(error)
    if (!isEmpty(error.cause)) {
        switch (error.code) {
            case EnumsError.INVALID_TYPES_ERROR:
                res.status(400).send({ status: 'error', error: error.name })
                break;
            case EnumsError.INVALID_PARAM_ERROR:
                res.status(400).send({ status: 'error', error: error.name })
                break;
            case EnumsError.DATABASE_ERROR:
                res.status(500).send({ status: 'error', error: error.name })
                break;
            default:
                res.send({ status: 'error', error: 'Unhadled error' })
        }
    } else if (!isEmpty(error.url)) {
        return res.render(error.url, {
            success: false,
            message: 'No cuenta con permisos para acceder a este recurso',
            statusCode: error.statusCode || 500
        });
    } else {
        return res.status(500).send({ success: false, message: error.message })
    }

}