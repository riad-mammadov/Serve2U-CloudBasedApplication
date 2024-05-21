<?php
include './dbconnection.php';

$order_id = $_POST['order_id'];

$conn->begin_transaction();

try {
    // Insert order into order history 
    $insert_order_query = "INSERT INTO order_history (order_id, total, created_at, username, seat, stadium) SELECT order_id, total, created_at, username, seat, stadium FROM orders WHERE order_id = ?";
    $stmt = $conn->prepare($insert_order_query);
    $stmt->bind_param("i", $order_id);
    $stmt->execute();

    // Insert related products from order items to order items history
    $insert_items_query = "INSERT INTO order_items_history (order_id, product_id, quantity) SELECT order_id, product_id, quantity FROM order_items WHERE order_id = ?";
    $item_stmt = $conn->prepare($insert_items_query);
    $item_stmt->bind_param("i", $order_id);
    $item_stmt->execute();

    // Deletes from order items
    $delete_items_query = "DELETE FROM order_items WHERE order_id = ?";
    $stmt = $conn->prepare($delete_items_query);
    $stmt->bind_param("i", $order_id);
    $stmt->execute();

    // Deletes the order from orders
    $delete_order_query = "DELETE FROM orders WHERE order_id = ?";
    $stmt = $conn->prepare($delete_order_query);
    $stmt->bind_param("i", $order_id);
    $stmt->execute();

    $conn->commit();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
