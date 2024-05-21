<?php
include './dbconnection.php';

header('Content-Type: application/json');

$query = "SELECT * FROM orders";
$result = $conn->query($query);

$orders = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['total'] = number_format($row['total'] / 100, 2, '.', '');
        $orders[] = $row;
    }
}

echo json_encode($orders);

$conn->close();
