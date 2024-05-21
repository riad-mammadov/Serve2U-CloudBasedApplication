<?php
include './dbconnection.php';

header('Content-Type: application/json');

$query = "SELECT username, email, name AS first_name, family_name AS last_name, birthdate AS dob FROM users";
$result = $conn->query($query);

$users = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);

$conn->close();

