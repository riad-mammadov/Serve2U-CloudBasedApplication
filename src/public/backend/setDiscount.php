<?php
include './dbconnection.php';

$code = $_POST['code'] ?? '';
$percent = $_POST['percent'] ?? 0;

if (empty($code) || $percent <= 0) {
    echo json_encode(['success' => false, 'message' => 'Code and percent must not be empty']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO discount_codes (code, discount_percent) VALUES (?, ?)");

if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare the statement: ' . $conn->error]);
    exit();
}

$stmt->bind_param("si", $code, $percent);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to execute the statement: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
