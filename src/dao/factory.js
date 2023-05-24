import config from '../config/index.js'

export let ProductDao;

switch (config.presistanceType) {
    case 'mongodb':
        ProductDao = (await import('./product/mongo.js')).default
        break;
    case 'file':
        ProductDao = (await import('./product/file.js')).default
        break;
    default:
        ProductDao = (await import('./product/file.js')).default
}