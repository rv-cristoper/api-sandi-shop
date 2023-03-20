import express from 'express';
import handlebars from 'express-handlebars';
import dotenv from "dotenv";
import __dirname from './utils.js';
import RoutesController from '../routes/index.js';
import { initDataBase } from '../db/mongodb.js';

// Use env
dotenv.config({ path: '.env' });

// Use MongoDB
initDataBase()

const app = express();

// Use handlebars
app.engine('hbs', handlebars.engine())
app.set('views', __dirname + '/../views')
app.set('view engine', 'hbs')

// Use public
app.use(express.static(__dirname + '/../../public'))

// Json config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Assign routes
RoutesController.createRoutes(app);

export default app;
