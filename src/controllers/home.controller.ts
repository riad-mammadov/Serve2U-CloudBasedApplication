import * as express from 'express'
import { Request, Response } from 'express'

// For this page a tutorial was followed for the authentication using cognito, as it was the first time implementing and using 
// AWS Cognito  

// https://www.youtube.com/watch?v=AQfA7OQEMqg&list=PLPMbb3KXRmigGdxkvrGfR4RmsU4J78_BQ

// This tutorial works on setting up all the routes and endpoints necessary, giving me a base to start off with, as to which i then implemented
// to work and adjusted it according to my project needs. The controller afterwards was adjusted slightly to work for my project

class HomeController {
    public path = '/'
    public router = express.Router()


    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/', this.home)
    }

    home = (req: Request, res: Response) => {
        res.send("success")
    }
}

export default HomeController