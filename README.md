Video Link: https://vimeo.com/983901055?share=copy
-------------------------

PROJECT SET UP GUIDE 

Pre Requisites - Node.js, PHP, MySQL, Composer (https://getcomposer.org/download/)

Folder Structure -

The src folder holds all of my relevant folders for my code including my servers

The public folder is what is served by my express server - all Javascript is left in the public folder along with the index.html
as the index html is served from the root of the public folder, the rest are in its respective folders.

HTML contains all my html, CSS contains all my css and the backend folder contains all my PHP files. In this PHP file you will find a DBConnection which you would adjust to your SQL connection.

Services contain the Cognito.services folder which communicates with cognito to sign up / log in / change password etc..

Middleware contains the middleware for the authentication

Controllers contain all the controllers

Note - In my keys folder there is a .txt file which contains the secret key and public key provided by Stripe. You can use the key and insert the private key in the MyServer.php ($stripe section, replace the STRIPE SECRET KEY with the actual secret key) and the public key in Cart.js (Checkoutbtn event listener function). This is only here for the marker to be able to use for convenience, and in any other case this would be stored as .env variables.

AI and Code reuse -

In this project, AI and online code (ie from stackOverflow) was used only to help structure code and debug errors. For cases that i did not know how to do something, i would use these only as a guide and help me (AI was used for some of the design however as it saved a lot of time, it gave me a base to work off allowing me to move on swiftly onto more important aspects of my project). Code reuse - Tutorials and githubs have been used to help format the page and they have been referenced at the top of the files where relevant.



Installation - 
1) Import the code file to your machine and navigate to the project directory
2) Install the required Node.js dependencies by running npm install, ensuring all dependencies are the same version as listed in the package.json



Installing Composer 
1) Upon downloading composer globally (The link is provided above), navigate to the root of the project directory and install the dependencies 
specified in the composer.json by running 'composer install' in the terminal. This is needed so that PHP can interact with Stripe.



Database Set Up
1) Create a new MySQL database to use with the application by running

CREATE DATABASE Serve2U;
USE Serve2U;

Ensuring that the database is running on the port 3306.

2) Import the provided SQL file to populate the database with neccessary tables/initial data, the SQL file is called serve2udatabase.sql which includes all my tables (Some data from testing may still be left behind) and along with necessary data such as products at the root of my project directory. It is also imported with a CREATE schema. You can add this by importing the file via MySQL Workbench.

3) In the auth.controller.ts (src > controllers > auth.controller.ts), update the database connection config to match your MySQL settings

The section will look like this - 
const pool = createPool({
    host: 'localhost',
    user: 'your_sql_user',
    password: "your_sql_password",
    database: "Serve2U",
    port: 3306
});



PHP Set Up
1) Ensure the PHP database connection settings are also correct matching your MySQL settings (src > public > backend > dbconnection.php)

The section will look like this 
$localhost = "localhost:3306";
$db = "Serve2U";
$user = "your_sql_user"; 
$pwd = "your_sql_password"; 

Make sure that the $localhost includes the port 3306 


Running the Application 
1) Start the servers using the npm script that was configured to concurrently run Node.js express server and the PHP server

'npm run dev' 

This command should start:
An express server running on the port 3000 
A PHP server running on the port 8080 

Please ensure that MySQL is running on the port 3306.

2) Once the script runs the servers, navigate to http://localhost:3000 which should take you to the index html page.

Using the Application
1) Use the application as you would, create an account using an Email that is accessible as a verification code will be sent to that email via SES which must be submitted into the form. The forgot password works the same way as it sends an email to the email that is associated to the username 
2) When attempting to log in with staff login, use this account as the account must be preconfigured in the Cognito user pool to be in the 'staff' group in order to access the Staff Dashboard.

Username: Test0033
Password: Password123@

This account is registered as a staff in my user pool so that the staff dashboard can be accessible for my marker, any other account wont be able to log into the staff dashboard, including the one that you created to sign up.

The account that you create to sign up can only log in as a user to purchase items.

3) In order to check out with Stripes payment service (Developers mode)
For the Card Number insert: 4242 4242 4242 4242
For the expiry date insert any date set in the future
The CVV can be any 3 digit number.

4) Upon making an order, you can open a new tab and log out, and use the staff log in provided to access the staff dashboard (For ease sake so you have access to both user and staff UIs and see how they interact with one another)

5) When adding an item to the menu, ensure that it is a valid file type specified in the add item php and insert the price of the items in pence (as it is stored as an integer in my database) so an item for £14.50 will be inserted as 1450. After it successfully adds the item to the menu, refresh the Cart.html (on the users side) in order to see the new item on the menu.

(In general if you expect something to happen and it doesnt, refresh the page)

Riad Mammadov.
