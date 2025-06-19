<?php
header('Content-Type: application/json');
require_once 'database.php';

try {
    $stmt = $db->prepare("SELECT name, score, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT 50");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Could not load leaderboard']);
}
