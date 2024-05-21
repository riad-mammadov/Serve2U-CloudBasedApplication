<?php
include './dbconnection.php';

// Check if an order_id is provided and prepare to use it in the query
$order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : null;

// SQL query to join tables: orders, order_items, users and products
$query = "
    SELECT
        o.order_id,
        o.total,
        o.created_at,
        o.username,
        o.seat,
        o.notes,
        o.stadium,
        o.seatrow,
        o.scheduled_time,    
        p.id AS product_id,
        p.name AS product_name,
        p.price AS product_price, 
        oi.quantity AS quantity,
        u.email AS user_email 
    FROM orders o
    INNER JOIN order_items oi ON o.order_id = oi.order_id
    INNER JOIN products p ON oi.product_id = p.id
    INNER JOIN users u ON o.username = u.username";
if ($order_id !== null) {
    // If an order_id is provided, it then adds a where clause to the query
    $query .= " WHERE o.order_id = ?";
}

$query .= " ORDER BY o.order_id ASC;";

if ($order_id !== null) {
    // Prepares and executes the query if an order id is specified
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($query);
}

// Empty array to hold the orders
$orders = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $order_id = $row['order_id'];  // Extracts the order_id from the current row

        if (!isset($orders[$order_id])) {  // Check if it's already started building this order in the $orders array
            $orders[$order_id] = [
                'order_id' => $order_id,
                'total' => number_format($row['total'] / 100, 2),
                'created_at' => $row['created_at'],
                'username' => $row['username'],
                'seat' => $row['seat'],
                'notes' => $row['notes'],
                'user_email' => $row['user_email'],
                'stadium' => $row['stadium'],
                'seatrow' => $row['seatrow'],
                'scheduled_time' => $row['scheduled_time'],
                'products' => []
            ];
        }
        // Adding product details to the array
        $orders[$order_id]['products'][] = [
            'product_id' => $row['product_id'],
            'product_name' => $row['product_name'],
            'quantity' => $row['quantity']
        ];
    }
}

echo json_encode(array_values($orders));
$conn->close();

