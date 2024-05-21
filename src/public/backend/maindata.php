<?php
include './dbconnection.php';

// SQL query to join three tables orders, order_items and products and select the needed fields
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
        oi.quantity AS quantity
    FROM orders o
    INNER JOIN order_items oi ON o.order_id = oi.order_id
    INNER JOIN products p ON oi.product_id = p.id
    ORDER BY o.order_id ASC;";

$result = $conn->query($query);

// Initialises an empty array to hold the orders
$orders = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $order_id = $row['order_id'];    // Extract the order_id from the current row

        if (!isset($orders[$order_id])) {          // Check if its already started building this order in the $orders array

            $orders[$order_id] = [
                'order_id' => $order_id, // Store the neccesary details
                'total' => number_format($row['total'] / 100, 2),
                'created_at' => $row['created_at'],
                'username' => $row['username'],
                'seat' => $row['seat'],
                'notes' => $row['notes'],
                'stadium' => $row['stadium'],
                'seatrow' => $row['seatrow'],
                'scheduled_time' => $row['scheduled_time'],
                'products' => []
            ];
        }
        // adding product details to the array
        $orders[$order_id]['products'][] = [
            'product_id' => $row['product_id'],
            'product_name' => $row['product_name'],
            'quantity' => $row['quantity']
        ];
    }
}

echo json_encode(array_values($orders)); // Convert to a array and send as json
$conn->close();
?>