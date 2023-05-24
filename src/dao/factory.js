import config from '../config/index.js'

export let ProductDao;
export let UserDao;

switch (config.presistanceType) {
    case 'mongodb':
        ProductDao = (await import('./product/mongo.js')).default
        UserDao = (await import('./user/mongo.js')).default
        break;
    case 'file':
        ProductDao = (await import('./product/file.js')).default
        UserDao = (await import('./user/file.js')).default
        break;
    default:
        ProductDao = (await import('./product/file.js')).default
        UserDao = (await import('./user/file.js')).default
}