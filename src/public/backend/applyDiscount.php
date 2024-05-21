<?php
include './dbconnection.php';
session_start();

header('Content-Type: application/json');

if (!isset($_COOKIE['username'])) {
    echo json_encode(['valid' => false, 'message' => 'No session found. Please log in.']);
    exit;
}

$username = $_COOKIE['username'];

// Gets the user ID based on the username from cookie
$stmt = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    $user_id = $row['user_id'];
} else {
    echo json_encode(['valid' => false, 'message' => 'User not found']);
    exit;
}

$code = $_POST['code'] ?? '';

// Finds the discount code in the database
$stmt = $conn->prepare("SELECT id, discount_percent FROM discount_codes WHERE code = ?");
$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();
if ($discount = $result->fetch_assoc()) {
    $discount_code_id = $discount['id'];

    // Checks if the user has already used the discount code (checks the user_discounts table where the discounts are linked to the users id)
    $stmt = $conn->prepare("SELECT id FROM user_discounts WHERE user_id = ? AND discount_code_id = ?");
    $stmt->bind_param("ii", $user_id, $discount_code_id);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        echo json_encode(['valid' => false, 'message' => 'This discount code has already been used.']);
        exit;
    }

    // Tracks the usage of the discount code
    $stmt = $conn->prepare("INSERT INTO user_discounts (user_id, discount_code_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $discount_code_id);
    $stmt->execute();
    echo json_encode(['valid' => true, 'discount' => $discount['discount_percent']]);
} else {
    echo json_encode(['valid' => false, 'message' => 'Invalid discount code']);
}
