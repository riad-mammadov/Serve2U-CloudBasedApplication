<?php

include 'dbconnection.php';

// Checks if the POST request has an 'order_id'
if (isset($_POST['order_id'])) {
    $orderId = $_POST['order_id'];

    $conn->begin_transaction();

    try {
        // Deletes related records in foreign key linked tables
        $stmt = $conn->prepare("DELETE FROM order_items WHERE order_id = ?");
        $stmt->bind_param("i", $orderId);
        $stmt->execute();

        // deletes the order from the table
        $stmt = $conn->prepare("DELETE FROM orders WHERE order_id = ?");
        $stmt->bind_param("i", $orderId);
        $stmt->execute();

        $conn->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Order ID not provided.']);
}

$conn->close();
