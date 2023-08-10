import dotenv from "dotenv";
dotenv.config({ path: '.env' });

export default {
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallback: process.env.GITHUB_CALLBACK,
    secretKey: process.env.SECRET_KEY,
    presistanceType: process.env.PERSISTENCE_TYPE || 'mongodb',
    nodeEnv: process.env.NODE_ENV || 'desarrollo',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    swaggerServer : process.env.SWAGGER_SERVER || `http://localhost:${process.env.PORT}`
}