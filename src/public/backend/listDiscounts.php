<?php
include './dbconnection.php';

header('Content-Type: application/json');

$result = $conn->query("SELECT id, code, discount_percent FROM discount_codes");
$discounts = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $discounts[] = $row;
    }
    echo json_encode(['success' => true, 'discounts' => $discounts]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch discounts: ' . $conn->error]);
}

$conn->close();
