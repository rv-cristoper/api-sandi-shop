import dotenv from "dotenv";
dotenv.config({ path: '.env' });
export default {
    presistanceType: process.env.PERSISTENCE_TYPE || 'file',
}