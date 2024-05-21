<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include './dbconnection.php';

// StackOverflow was used to help me with moving the image from one directory to another
// While i ran into a few problems, AI was also promted to help me issues i came across as i could not fix them myself

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $conn->real_escape_string($_POST['itemName']);
    $price = intval($_POST['itemPrice']);
    $category = $conn->real_escape_string($_POST['itemCategory']);
    $image = $_FILES['itemImage'];


    // Defines the target directory
    $targetDirectory = $_SERVER['DOCUMENT_ROOT'] . "/src/public/html/images/" . $category . "/";

    $targetFile = $targetDirectory . basename($image['name']);
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if image file is a valid image
    $check = getimagesize($image["tmp_name"]);
    if ($check === false) {
        echo json_encode(['success' => false, 'error' => "File is not an image."]);
        exit();
    }

    // Check file size (500KB)
    if ($image["size"] > 500000) {
        echo json_encode(['success' => false, 'error' => "File is too large."]);
        exit();
    }

    // Allow certain file formats such as jpg jpeg etc...
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        echo json_encode(['success' => false, 'error' => "Only JPG, Jpeg, png & Gif files are allowed."]);
        exit();
    }

    // Attempt to move the uploaded file to the target directory which is my /html/images/$category folder
    if (!move_uploaded_file($image['tmp_name'], $targetFile)) {
        echo json_encode(['success' => false, 'error' => "There was an error uploading your file."]);
        exit();
    }

    // Set the relative image path for storing in the database
    $relativeImagePath = "images/" . $category . "/" . basename($image['name']);

    // Inserts into the database
    $stmt = $conn->prepare("INSERT INTO products (name, price, image, category) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siss", $name, $price, $relativeImagePath, $category);

    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
        $stmt->close();
        exit();
    }

    $stmt->close();
    echo json_encode(['success' => true, 'message' => "Item added successfully"]);
} else {
    echo json_encode(['success' => false, 'error' => "Failed to add item"]);
}

