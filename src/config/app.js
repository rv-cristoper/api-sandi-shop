import express from 'express';
import handlebars from 'express-handlebars';
import dotenv from "dotenv";
import __dirname from './utils.js';
import RoutesController from '../routes/index.js';
import { initDataBase } from '../db/mongodb.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initPassportSession from './passport.config-session.js';
import initPassport from './passport.config.js';
import passport from 'passport'

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

// Cookie
app.use(cookieParser(process.env.SECRET_KEY))

// Express session
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}))
initPassportSession()
initPassport()

app.use(passport.initialize())
app.use(passport.session())

// Assign routes
RoutesController.createRoutes(app);

app.use((err, req, res, next) => {
    if (err.url) {
        return res.render(err.url, {
            success: false,
            message: 'No cuenta con permisos para acceder a este recurso',
            statusCode: err.statusCode || 500
        });
    }
    return res.status(500).send({ success: false, message: err.message })
})

export default app;
