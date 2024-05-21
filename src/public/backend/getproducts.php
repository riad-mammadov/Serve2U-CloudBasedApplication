<?php

include './dbconnection.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// The SQL query to fetch all products, including the price and image
$query = "SELECT id, name, price FROM products ORDER BY name ASC;";
$result = $conn->query($query);

// Array to store the products
$products = [];

// Fetchs the products from the database
if ($result) {
    while ($row = $result->fetch_assoc()) {
        array_push($products, $row);
    }

    echo json_encode(['success' => true, 'products' => $products]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to retrieve products.']);
}

$conn->close();

