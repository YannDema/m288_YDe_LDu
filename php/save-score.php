<?php
header('Content-Type: application/json');
require_once 'database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = trim($input['name'] ?? 'Anonymous');
    $score = intval($input['score'] ?? 0);

    if ($score <= 0 || strlen($name) === 0) {
        throw new Exception('Invalid name or score');
    }

    $stmt = $db->prepare("INSERT INTO scores (name, score) VALUES (:name, :score)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':score', $score);
    $stmt->execute();

    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
