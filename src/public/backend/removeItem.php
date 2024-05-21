<?php

include './dbconnection.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $itemId = isset($_POST['item_id']) ? $conn->real_escape_string($_POST['item_id']) : '';

    if (empty($itemId)) {
        echo json_encode(['success' => false, 'error' => "Item ID is required."]);
        exit();
    }

    // Prepares the delete statement
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $itemId);

    if ($stmt->execute()) {
        // Check if any rows were deleted
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => "Item removed successfully."]);
        } else {
            echo json_encode(['success' => false, 'error' => "Item not found or already removed."]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => "Failed to remove the item."]);
    }

    // Close statement
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => "Invalid request method."]);
}

$conn->close();

