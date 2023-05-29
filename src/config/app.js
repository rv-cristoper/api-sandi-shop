import express from 'express';
import handlebars from 'express-handlebars';
import dotenv from "dotenv";
import __dirname from '../utils/index.js';
import router from '../routes/index.js';
import { initDataBase } from './mongodb.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initPassport from './passport.js';
import passport from 'passport'
import config from './index.js'
// import errorMiddleware from '../utils/errors/MiddlewareError.js'

if (config.presistanceType === 'mongodb') {
    // Use MongoDB
    await initDataBase()
}

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
app.use(cookieParser(config.secretKey))

// Express session
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongodbUri,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60
    }),
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false
}))
initPassport()

app.use(passport.initialize())
app.use(passport.session())

// Assign routes
app.use('', router)
// app.use(errorMiddleware)
// RoutesController.createRoutes(app);

app.use((err, req, res, next) => {
console.log(err)
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
