<?php
include './dbconnection.php';

// Check if review id is provided
if (isset($_POST['review_id'])) {
    $review_id = $_POST['review_id'];

    // Prepares the delete statement
    $query = "DELETE FROM product_reviews WHERE review_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $review_id);

    // Executes the query and check for successful deletion
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Review deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete review']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Review ID not provided']);
}

