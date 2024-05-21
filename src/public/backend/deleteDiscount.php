<?php
include './dbconnection.php';

$discount_id = $_POST['discount_id'] ?? '';

if (empty($discount_id)) {
    echo json_encode(['success' => false, 'message' => 'Discount ID must not be empty']);
    exit();
}

$conn->begin_transaction();

if (!$conn->query("DELETE FROM user_discounts WHERE discount_code_id = $discount_id")) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete user discounts: ' . $conn->error]);
    $conn->rollback();
    exit();
}

if (!$conn->query("DELETE FROM discount_codes WHERE id = $discount_id")) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete discount: ' . $conn->error]);
    $conn->rollback();
    exit();
}

$conn->commit();
echo json_encode(['success' => true]);
$conn->close();
