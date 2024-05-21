import * as express from 'express'
import { Request, Response } from 'express'

import AuthMiddleware from '../middleware/auth.middleware';

// For this page a tutorial was followed for the authentication using cognito, as it was the first time implementing and using 
// AWS Cognito  

// https://www.youtube.com/watch?v=AQfA7OQEMqg&list=PLPMbb3KXRmigGdxkvrGfR4RmsU4J78_BQ

// This tutorial works on setting up all the routes and endpoints necessary, giving me a base to start off with, as to which i then implemented
// to work and adjusted it according to my project needs. The controller afterwards was adjusted slightly to work for my project

class ProtectedController {
  public path = '/protected'
  public router = express.Router()
  private authMiddleware;

  constructor() {
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes()
  }

  public initRoutes() {
    this.router.use(this.authMiddleware.verifyToken)
    this.router.get('/secret', this.secret)
  }

  secret = (req: Request, res: Response) => {
    res.status(200).send("Token is valid.");
  }


}

export default ProtectedController;