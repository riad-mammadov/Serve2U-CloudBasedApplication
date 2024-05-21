import { Request, Response } from 'express';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

// For this page a tutorial was followed for the authentication using cognito, as it was the first time implementing and using 
// AWS Cognito  

// https://www.youtube.com/watch?v=AQfA7OQEMqg&list=PLPMbb3KXRmigGdxkvrGfR4RmsU4J78_BQ

// This tutorial works on setting up all the routes and endpoints necessary, giving me a base to start off with, as to which i then implemented
// to work and adjusted it according to my project needs. 

let pems = {}

class AuthMiddleware {
    private poolRegion: string = 'us-east-1';
    private userPoolId: string = 'us-east-1_uoSOT79Gf';

    constructor() {
        this.setUp()
    }

    verifyToken(req: Request, resp: Response, next): void {
        const token = req.header('Auth');
        console.log(token)
        if (!token) resp.status(401).end();

        let decodedJwt: any = jwt.decode(token, { complete: true });
        if (decodedJwt === null) {
            resp.status(401).end()
            return
        }
        console.log(decodedJwt)
        let kid = decodedJwt.header.kid;
        let pem = pems[kid];
        console.log(pem)
        if (!pem) {
            resp.status(401).end()
        }
        jwt.verify(token, pem, function (err: any, payload: any) {
            if (err) {
                resp.status(401).end()
            } else {
                next()
                console.log("Success")
            }
        })
    }

    private async setUp() {
        const URL = `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_uoSOT79Gf/.well-known/jwks.json`;

        try {
            const response = await fetch(URL);
            if (response.status !== 200) {
                throw 'request not successful'
            }
            const data = await response.json();
            const { keys } = data;
            for (let i = 0; i < keys.length; i++) {
                const key_id = keys[i].kid;
                const modulus = keys[i].n;
                const exponent = keys[i].e;
                const key_type = keys[i].kty;
                const jwk = { kty: key_type, n: modulus, e: exponent };
                const pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            console.log("got PEMS")
        } catch (error) {
            console.log(error)
            console.log('Error! Unable to download JWKs');
        }
    }


}

export default AuthMiddleware