import CustomError from "../utils/errors/CustomError.js";
import EnumsError from "../utils/errors/EnumsError.js";
import { generatorProductError } from "../utils/errors/MessagesError.js";

export const validateAddPRoduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];

        const missingFields = requiredFields.filter(field => !productData[field]);
        if (missingFields.length) {
            const error = CustomError.createError({
                name: 'Error al crear el producto',
                cause: generatorProductError(productData),
                message: 'Error al intentar crear el producto',
                code: EnumsError.INVALID_TYPES_ERROR,
            });
            throw error;
        }
        next()
    } catch (error) {
        next(error)
    };
};