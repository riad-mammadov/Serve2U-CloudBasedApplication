import AWS from 'aws-sdk';
import crypto from 'crypto';

// For this page a tutorial was followed for the authentication using cognito, as it was the first time implementing and using 
// AWS Cognito  

// https://www.youtube.com/watch?v=AQfA7OQEMqg&list=PLPMbb3KXRmigGdxkvrGfR4RmsU4J78_BQ

// // This tutorial works on setting up all the routes and endpoints necessary, giving me a base to start off with, as to which i then implemented
// to work and adjusted it according to my project needs.  The controller afterwards was adjusted slightly to work for my project


class CognitoService {
    private config = {
        region: 'us-east-1'
    }
    private secretHash: string = '1v75ft84ps88qhsffs8vbanjojahvg9s8738om464m0lnh06lgs6'
    private clientId: string = '56q8i0a2kvcr7nh3svg2bcan2j'

    private cognitoIdentity;

    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config)
    }

    public async getUserDetails(accessToken: string): Promise<AWS.CognitoIdentityServiceProvider.GetUserResponse | null> {
        const params = {
            AccessToken: accessToken
        };

        try {
            const userDetails = await this.cognitoIdentity.getUser(params).promise();
            console.log("User details fetched successfully:", userDetails);
            return userDetails;
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            return null;
        }
    }

    public async signUpUser(username: string, password: string, userAttr: Array<any>): Promise<boolean> {

        const params = {
            ClientId: this.clientId,
            Password: password,
            Username: username,
            SecretHash: this.generateHash(username),
            UserAttributes: userAttr
        }

        try {
            const data = await this.cognitoIdentity.signUp(params).promise()
            console.log(data)
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    public async verifyAccount(username: string, code: string): Promise<boolean> {
        const params = {
            ClientId: this.clientId,
            ConfirmationCode: code,
            SecretHash: this.generateHash(username),
            Username: username

        }

        try {
            const data = await this.cognitoIdentity.confirmSignUp(params).promise();
            console.log(data)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    public async signInUser(username: string, password: string): Promise<{ idToken: string } | null> {
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                'USERNAME': username,
                'PASSWORD': password,
                'SECRET_HASH': this.generateHash(username)
            }
        };

        try {
            let data = await this.cognitoIdentity.initiateAuth(params).promise();
            console.log("Authentication successful:", data);
            if (data.AuthenticationResult && data.AuthenticationResult.IdToken) {
                return { idToken: data.AuthenticationResult.IdToken };
            } else {
                console.log("Token not found in the authentication result.");
                return null;
            }
        } catch (error) {
            console.log("Authentication error:", error);
            return null;
        }
    }
    public async forgotPassword(username): Promise<boolean> {
        var params = {
            ClientId: this.clientId,
            Username: username,
            SecretHash: this.generateHash(username),
        }

        try {
            const data = await this.cognitoIdentity.forgotPassword(params).promise();
            console.log(data);
            return true
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async confirmNewPassword(username: string, password: string, code: string): Promise<boolean> {
        var params = {
            ClientId: this.clientId,
            ConfirmationCode: code,
            Password: password,
            Username: username,
            SecretHash: this.generateHash(username),
        };

        try {
            const data = await this.cognitoIdentity.confirmForgotPassword(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    private generateHash(username: string): string {
        return crypto.createHmac('SHA256', this.secretHash)
            .update(username + this.clientId)
            .digest('base64')
    }
}

export default CognitoService;