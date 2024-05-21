import App from './app'

import * as bodyParser from 'body-parser'

import HomeController from './controllers/home.controller'
import AuthController from './controllers/auth.controller'
import ProtectedController from './controllers/protected.controller';

import express from 'express';
import path from 'path';

const app = new App({
    port: 3000,
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        express.static(path.join(__dirname, 'public'))

    ],
    controllers: [
        new HomeController(),
        new AuthController(),
        new ProtectedController()

    ]

})

app.listen();