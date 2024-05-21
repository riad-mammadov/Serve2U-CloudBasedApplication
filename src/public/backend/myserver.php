<?php

// For this page a tutorial was followed however the design was completely refined along with the functionality, but the core base of the
// cart.html page uses this tutorial to help as it was the first time implementing a payment system into a project 
// The php file has been heavily modified to suit the needs of my project.

// https://www.youtube.com/watch?v=LgnITjRQnlM

require './dbconnection.php';
require './item.php';
require __DIR__ . './../../../vendor/autoload.php';



session_start();




// This section was taken from the video linked above but fit to my project

// if request method is get, display contents in products table using get request
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = "select * from products;";
    $result = $conn->query($stmt);
    if ($result->num_rows) {
        $array = array();
        while ($row = $result->fetch_assoc()) {
            array_push($array, new Item($row['id'], $row['name'], $row['price'], $row['image'], $row['category']));
        }
        echo json_encode($array);
    } else
        echo "Something went wrong. Try again later!!!";
    exit();
}




// if post request, get contents and redirect to stripe payment services
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $conn->begin_transaction();

    try {
        $jsonInput = json_decode(trim(file_get_contents('php://input')));
        $itemList = $jsonInput->items;
        $total = 0;
        $orderItems = [];

        // Checks if the following values are set and ddefines them
        $notes = $conn->real_escape_string($jsonInput->notes);
        $discountPercent = isset($jsonInput->discountPercent) ? $jsonInput->discountPercent : 0;
        $username = isset($_COOKIE['username']) ? $conn->real_escape_string($_COOKIE['username']) : null;
        $seat = isset($_COOKIE['seat']) ? $conn->real_escape_string($_COOKIE['seat']) : null;
        $stadium = isset($_COOKIE['stadium']) ? $conn->real_escape_string($_COOKIE['stadium']) : null;
        $seatrow = isset($_COOKIE['seatrow']) ? $conn->real_escape_string($_COOKIE['seatrow']) : null;
        $scheduledTime = isset($jsonInput->scheduledTime) ? $conn->real_escape_string($jsonInput->scheduledTime) : null;

        foreach ($itemList as $item) {
            $id = $conn->real_escape_string($item->id);
            $quantity = intval($item->quantity);
            $result = $conn->query("SELECT price FROM products WHERE id = '$id'");
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $price = $row['price'];
                $total += $price * $quantity;
                array_push($orderItems, ['product_id' => $id, 'quantity' => $quantity, 'price' => $price]);
            }
        }

        if ($discountPercent > 0) {
            $total *= (1 - ($discountPercent / 100)); // Applies the discount price to the total if there is any
        }

        $_SESSION['order_data'] = [
            'total' => $total,
            'username' => $username,
            'seat' => $seat,
            'stadium' => $stadium,
            'seatrow' => $seatrow,
            'notes' => $notes,
            'scheduled_time' => $scheduledTime,
            'order_items' => $orderItems
        ];


        $stripe = new Stripe\StripeClient('My Secret Key');
        $session = $stripe->checkout->sessions->create([
            'success_url' => 'http://localhost:8080/src/public/html/success.php?sessionId={CHECKOUT_SESSION_ID}', // {checkout session id creates a unique page with their stripe checkout id as a parameter}
            'cancel_url' => 'http://localhost:8080/src/public/html/cart.html?status=failure',
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => [
                [
                    'quantity' => 1,
                    'price_data' => [
                        'currency' => 'gbp',
                        'unit_amount' => intval($total),
                        'product_data' => [
                            'name' => 'Serve2U',
                            'description' => 'Your Invoice for Serve2U'
                        ]
                    ]
                ]
            ]
        ]);


        echo json_encode(['id' => $session->id]);
        $conn->commit();


    } catch (Exception $e) {
        $conn->rollback();
        error_log("Error processing the POST request: " . $e->getMessage());
        echo json_encode(['error' => $e->getMessage()]);
    }
}

