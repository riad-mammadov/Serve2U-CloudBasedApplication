<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Success</title>
    <link rel="stylesheet" href="http://localhost:3000/css/success.css">
    <link rel="stylesheet" href="http://localhost:3000/css/index.css">


</head>

<body>
    <?php
    session_start();
    include '../backend/dbconnection.php';

    if (isset($_SESSION['order_data']) && isset($_GET['sessionId'])) {
        $data = $_SESSION['order_data'];
        $conn->begin_transaction();


        try {
            $insertOrderQuery = "INSERT INTO orders (total, created_at, username, seat, stadium, seatrow, notes, scheduled_time) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($insertOrderQuery);
            $stmt->bind_param("dssssss", $data['total'], $data['username'], $data['seat'], $data['stadium'], $data['seatrow'], $data['notes'], $data['scheduled_time']);
            if (!$stmt->execute()) {
                throw new Exception("Failed to insert order: " . $conn->error);
            }
            $orderId = $conn->insert_id;

            foreach ($data['order_items'] as $item) {
                $insertItemQuery = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($insertItemQuery);
                $stmt->bind_param("iidi", $orderId, $item['product_id'], $item['quantity'], $item['price']);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to insert order item: " . $conn->error);
                }
            }
            $conn->commit();
            unset($_SESSION['order_data']);
        } catch (Exception $e) {
            $conn->rollback();
            echo '<p class="alert-danger">Error processing your order: ' . $e->getMessage() . ' Please contact support.</p>';
        }
    } else {
        echo '<p class="alert-danger">Session expired.</p>';
    }

    // This script inserts the order details to the database only after they are successfully redirected to success html, and only if the
    // Session data has been set (on myserver.php).
    // AI was used in order to help me to debug errors as i came across a few.
    
    ?>

    <header class="main-header">
        <nav class="navbar">
            <img src="./images/Serve2ULogo.png" alt="Serve2U Logo" class="logo">
            <ul class="nav-links">
                <li><a href="http://localhost:3000">Home</a></li>
                <li><a href="http://localhost:3000/html/order_history.html" id="orderHistoryLink"
                        class="history-button hidden">My Order
                        History</a></li>
                <li><a href="http://localhost:8080/src/public/html/cart.html">Order Now</a></li>

                <li><button id="logoutButton" class="logout-button hidden">Logout</button></li>

            </ul>
        </nav>
    </header>
    <div class="container">
        <div class="order-success">
            <h1>Thank you for buying from Serve2U</h1>
            <p>Your order has been successfully processed and is on its way. </p>
            <p>Please
                keep an eye out to your emails as one of
                our staff members may contact you regarding your order.
            </p>
            <div class="actions">
                <button onclick="location.href='http://localhost:3000'">Back to Home</button>
                <button onclick="location.href='http://localhost:8080/src/public/html/cart.html'">Back to Menu</button>

                <button onclick="toggleReview()">Leave a Review</button>
            </div>
        </div>

        <!-- Review modal-->
        <div id="reviewModal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Leave a Review</h2>
                <label for="productSelect">Select Item:</label>

                <select id="productSelect">
                </select>
                <textarea id="reviewText" placeholder="Enter your review here..."></textarea>
                <label for="rating">Rating:</label>
                <select id="rating">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5" selected>5</option>
                </select>
                <button onclick="submitReview()" class="submit">Submit Review</button>
            </div>
        </div>

    </div>
    <script src="http://localhost:3000/success.js"></script>
</body>

</html>