import express from 'express'
import { Application } from 'express'
import * as dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();

const path = require('path');


app.use(cookieParser());

class App {
    public app: Application
    public port: number

    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port

        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
    }


    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        });
        this.app.use('/backend', createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        }));
    }



    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {

        this.app.use(express.static(path.join(__dirname, '..')));
        this.app.get('/', (req, res) => {
        });


        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router)
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }
}

export default App