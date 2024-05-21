<?php

include './dbconnection.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

// Check if the necessary data is present in the POST request
if (isset($_POST['itemId'], $_POST['itemName'], $_POST['itemPrice'])) {
    $itemId = $_POST['itemId'];
    $itemName = $_POST['itemName'];
    $itemPrice = $_POST['itemPrice'];

    $stmt = $conn->prepare("UPDATE products SET name = ?, price = ? WHERE id = ?");
    $stmt->bind_param("sii", $itemName, $itemPrice, $itemId);

    // Executes the statement and check if it was successful
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update item']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
}

$conn->close();


