<?php
include './dbconnection.php';

$data = json_decode(file_get_contents('php://input'), true);
$orderIds = $data['orderIds'];
$response = ['success' => false, 'error' => ''];

if (empty($orderIds)) {
    $response['error'] = 'No order IDs provided.';
    echo json_encode($response);
    exit;
}

$conn->begin_transaction();

try {
    // Delete related order items from order_items_history
    $query = "DELETE FROM order_items_history WHERE order_id IN (" . implode(',', $orderIds) . ")";
    if (!$conn->query($query)) {
        throw new Exception("Error deleting order items: " . $conn->error);
    }

    // Delete orders from order_history
    $query = "DELETE FROM order_history WHERE order_id IN (" . implode(',', $orderIds) . ")";
    if (!$conn->query($query)) {
        throw new Exception("Error deleting orders: " . $conn->error);
    }

    // Commit it
    $conn->commit();
    $response['success'] = true;

} catch (Exception $e) {
    $conn->rollback();
    $response['error'] = $e->getMessage();
}

// Close connection
$conn->close();

// Return response
echo json_encode($response);