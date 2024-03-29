import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import __dirname from '../utils/index.js';
import config from "./index.js";

const PORT = config.port
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API with Swagger",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: config.swaggerServer,
      },
    ],
    host: config.swaGgerHost
  },
  apis: [path.join(__dirname, "..", "docs", "**", "*.yaml")],
};

const specs = swaggerJsdoc(options);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};