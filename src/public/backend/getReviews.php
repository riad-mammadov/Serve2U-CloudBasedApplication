<?php
include './dbconnection.php';

$product_id = $_GET['product_id'];
$query = "SELECT * FROM product_reviews WHERE product_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $product_id);
$stmt->execute();
$result = $stmt->get_result();
$reviews = [];

while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode($reviews);
