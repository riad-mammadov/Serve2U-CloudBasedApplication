<?php


include './dbconnection.php';

// Query to join order history and order items history tables
$query = "
    SELECT
        oh.order_id,
        oh.total,
        oh.created_at,
        oh.username,
        oh.stadium,
        oih.product_id,
        oih.quantity,
        p.name AS product_name
    FROM order_history oh
    LEFT JOIN order_items_history oih ON oh.order_id = oih.order_id
    LEFT JOIN products p ON oih.product_id = p.id
    ORDER BY oh.order_id ASC;";

$result = $conn->query($query);

$orderHistory = [];

if ($result->num_rows > 0) {
    // Gets data of each row
    while ($row = $result->fetch_assoc()) {
        $order_id = $row['order_id'];

        if (!isset($orderHistory[$order_id])) {
            $orderHistory[$order_id] = [
                'order_id' => $row['order_id'],
                'total' => number_format($row['total'] / 100, 2), // Diviides by 100 as order is in pence originally
                'created_at' => $row['created_at'],
                'username' => $row['username'],
                'stadium' => $row['stadium'],
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