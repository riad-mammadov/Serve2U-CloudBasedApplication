<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cookie');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include './dbconnection.php';

$username = isset($_GET['username']) ? $_GET['username'] : '';

// SQL query to join order_history and order_items_history tables filtered by username
$query = "
    SELECT
        oh.order_id,
        oh.total,
        oh.created_at,
        oh.username,
        oih.product_id,
        oih.quantity,
        p.name AS product_name
    FROM order_history oh
    LEFT JOIN order_items_history oih ON oh.order_id = oih.order_id
    LEFT JOIN products p ON oih.product_id = p.id
    WHERE oh.username = ?
    ORDER BY oh.order_id ASC;";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// array to hold the order history data
$orderHistory = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $order_id = $row['order_id'];

        if (!isset($orderHistory[$order_id])) {
            $orderHistory[$order_id] = [
                'order_id' => $row['order_id'],
                'total' => number_format($row['total'] / 100, 2),
                'created_at' => $row['created_at'],
                'username' => $row['username'],
                'products' => []
            ];
        }

        $orderHistory[$order_id]['products'][] = [
            'product_id' => $row['product_id'],
            'product_name' => $row['product_name'],
            'quantity' => $row['quantity']
        ];
    }
}

echo json_encode(array_values($orderHistory));
$conn->close();
