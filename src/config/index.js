import dotenv from "dotenv";
dotenv.config({ path: '.env' });

export default {
    port: process.env.PORT || 8080,
    mongodbUri: process.env.MONGODB_URI,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallback: process.env.GITHUB_CALLBACK,
    secretKey: process.env.SECRET_KEY,
    presistanceType: process.env.PERSISTENCE_TYPE || 'file',
    nodeEnv: process.env.NODE_ENV || 'desarrollo'
}