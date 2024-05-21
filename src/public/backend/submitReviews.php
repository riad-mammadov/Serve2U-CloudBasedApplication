<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include './dbconnection.php';

$data = json_decode(file_get_contents("php://input"), true);

$product_id = $data['product_id'];
$username = $data['username'];
$review_text = $data['review_text'];
$rating = $data['rating'];

$query = "INSERT INTO product_reviews (product_id, username, review_text, rating) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("issi", $product_id, $username, $review_text, $rating);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>