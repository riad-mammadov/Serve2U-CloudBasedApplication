<?php
include './dbconnection.php';

header('Content-Type: application/json');

// Joins product_reviews with products table and display it on the manage review section
$query = "
    SELECT pr.review_id, pr.product_id, pr.username, pr.review_text, pr.rating, pr.created_at, p.name as product_name
    FROM product_reviews pr
    JOIN products p ON pr.product_id = p.id
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(['error' => 'Error preparing statement: ' . $conn->error]);
    exit;
}

$stmt->execute();
$result = $stmt->get_result();
$reviews = [];

while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode($reviews);
