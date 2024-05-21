import * as express from 'express'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

import CognitoService from '../services/cognito.service';
import { createPool } from 'mysql2/promise';

// For this page a tutorial was followed for the authentication using cognito, as it was the first time implementing and using 
// AWS Cognito  

// https://www.youtube.com/watch?v=AQfA7OQEMqg&list=PLPMbb3KXRmigGdxkvrGfR4RmsU4J78_BQ

// // This tutorial works on setting up all the routes and endpoints necessary, giving me a base to start off with, as to which i then implemented
// to work and adjusted it according to my project needs.  The controller afterwards was adjusted to work for my project

// Ensure that you also enter the username and password into here for the database (This allows signed up users to get pushed into the DB)
const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: "password",
    database: "serve2u",
    port: 3306
});

class AuthController {
    public path = '/auth'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.post('/signup', this.validateBody('signUp'), this.signUp)
        this.router.post('/signin', this.validateBody('signIn'), this.signIn)
        this.router.post('/verify', this.validateBody('verify'), this.verify)
        this.router.post('/forgot-password', this.validateBody('forgotPassword'), this.forgotPassword)
        this.router.post('/confirm-password', this.validateBody('confirmPassword'), this.confirmPassword)

    }

    public async signUp(req: Request, res: Response) {
        const result = validationResult(req);
        console.log(req.body);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }

        const { username, password, email, name, family_name, birthdate } = req.body;

        let userAttr = [];
        userAttr.push({ Name: 'email', Value: email });
        userAttr.push({ Name: 'name', Value: name });
        userAttr.push({ Name: 'family_name', Value: family_name });
        userAttr.push({ Name: 'birthdate', Value: birthdate });

        const cognito = new CognitoService();

        try {
            const success = await cognito.signUpUser(username, password, userAttr);
            if (success) {
                const connection = await pool.getConnection();
                await connection.execute(
                    `INSERT INTO users (username, email, name, family_name, birthdate) VALUES (?, ?, ?, ?, ?)`,
                    [username, email, name, family_name, birthdate]
                );
                connection.release();
                res.json({ success: true });
            } else {
                res.status(500).json({ success: false, message: "Failed to create user in Cognito." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    signIn = (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { username, password } = req.body;
        const cognito = new CognitoService();

        cognito.signInUser(username, password)
            .then(response => {
                if (response && response.idToken) {
                    const decodedToken = jwt.decode(response.idToken);
                    const username = decodedToken['cognito:username'] || decodedToken['username'];
                    const name = decodedToken['name'];
                    const groups = decodedToken['cognito:groups'] || [];


                    res.json({
                        success: true,
                        token: response.idToken,
                        username,
                        name,
                        groups
                    });
                } else {
                    res.status(401).json({ success: false, message: "Authentication failed" });
                }
            })
            .catch(error => {
                res.status(500).json({ success: false, message: error.message });
            });
    }

    confirmPassword = (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { username, password, code } = req.body;

        const cognito = new CognitoService();
        cognito.confirmNewPassword(username, password, code)
            .then(success => {
                success ? res.status(200).end() : res.status(400).end()
            })
    }

    forgotPassword = (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { username } = req.body;

        const cognito = new CognitoService();
        cognito.forgotPassword(username)
            .then(success => {
                success ? res.status(200).end() : res.status(400).end()
            });
    }

    verify = (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() })
        }

        const { username, code } = req.body

        const cognito = new CognitoService();
        cognito.verifyAccount(username, code)
            .then(success => {
                if (success) {
                    res.json({ success: true, message: "Verification successful" });
                } else {
                    res.status(500).end()
                }
            })

        console.log('verify body is valid')

    }

    private validateBody(type: string) {
        switch (type) {
            case 'signUp':
                return [
                    body('username').notEmpty().isLength({ min: 5 }),
                    body('email').notEmpty().normalizeEmail().isEmail(),
                    body('password').isString().isLength({ min: 8 }),
                    body('birthdate').exists().isISO8601(),
                    body('name').notEmpty().isString(),
                    body('family_name').notEmpty().isString()
                ]

            case 'signIn':
                return [
                    body('username').notEmpty().isLength({ min: 5 }),
                    body('password').isString().isLength({ min: 8 }),
                ]

            case 'verify':
                return [
                    body('username').notEmpty().isLength({ min: 5 }),
                    body('code').notEmpty().isString().isLength({ min: 6, max: 6 })
                ]
            case 'forgotPassword':
                return [
                    body('username').notEmpty().isLength({ min: 5 }),
                ]
            case 'confirmPassword':
                return [
                    body('password').exists().isLength({ min: 8 }),
                    body('username').notEmpty().isLength({ min: 5 }),
                    body('code').notEmpty().isString().isLength({ min: 6, max: 6 })
                ]

            default:
                break;
        }
    }

}

export default AuthController