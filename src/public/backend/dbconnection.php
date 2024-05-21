<?php


// Into these enter your username and password you created when importing the database 

$localhost = "localhost:3306";
$db = "Serve2U";
$user = "root";
$pwd = "password";



$conn = new mysqli($localhost, $user, $pwd, $db);
if ($conn->connect_errno) {
    echo "Not connected" . $conn->connect_error;
    exit();
}