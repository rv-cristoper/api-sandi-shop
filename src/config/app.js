import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from '../utils/index.js';
import router from '../routes/index.js';
import { initDataBase } from './mongodb.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initPassport from './passport.js';
import passport from 'passport'
import config from './index.js'
import errorMiddleware from '../utils/errors/MiddlewareError.js'
import swagger from "./swagger.js";

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

// Swagger
swagger(app)

// Assign routes
app.use('', router)
app.use(errorMiddleware)

export default app;
