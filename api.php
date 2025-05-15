<?php
// Verbindungsparameter für die Datenbank
$host = 'localhost';
$dbname = 'dino_game';
$username = 'root';
$password = '';

// Datenbank-Verbindung herstellen
function verbindeDatenbank() {
    global $host, $dbname, $username, $password;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Datenbankfehler: " . $e->getMessage());
        return null;
    }
}

// Prüfen, welche Aktion ausgeführt werden soll
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action'])) {
    $action = $_GET['action'];
    
    switch ($action) {
        case 'speichern':
            speichereHighscore();
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Ungültige Aktion']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];
    
    switch ($action) {
        case 'laden':
            ladeLeaderboard();
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Ungültige Aktion']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Keine Aktion angegeben']);
}

// Highscore speichern
function speichereHighscore() {
    // JSON-Daten aus dem Request-Body lesen
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Eingabe validieren
    if (!isset($input['username']) || !isset($input['score'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Fehlende Parameter']);
        return;
    }
    
    // Daten bereinigen
    $username = htmlspecialchars(trim($input['username']));
    $score = (int) $input['score'];
    
    // Verbindung zur Datenbank herstellen
    $pdo = verbindeDatenbank();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'Datenbankverbindung fehlgeschlagen']);
        return;
    }
    
    try {
        // SQL-Anweisung vorbereiten
        $stmt = $pdo->prepare("INSERT INTO highscores (username, score, datum) VALUES (:username, :score, NOW())");
        
        // Parameter binden
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':score', $score);
        
        // SQL-Anweisung ausführen
        $stmt->execute();
        
        // Erfolg zurückmelden
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        error_log("Fehler beim Speichern des Highscores: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Speichern des Highscores']);
    }
}

// Leaderboard laden
function ladeLeaderboard() {
    // Verbindung zur Datenbank herstellen
    $pdo = verbindeDatenbank();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'Datenbankverbindung fehlgeschlagen']);
        return;
    }
    
    try {
        // SQL-Anweisung vorbereiten
        $stmt = $pdo->prepare("SELECT username, score, datum FROM highscores ORDER BY score DESC LIMIT 10");
        
        // SQL-Anweisung ausführen
        $stmt->execute();
        
        // Ergebnisse holen
        $ergebnisse = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Erfolg zurückmelden
        echo json_encode(['success' => true, 'highscores' => $ergebnisse]);
    } catch (PDOException $e) {
        error_log("Fehler beim Laden des Leaderboards: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Laden des Leaderboards']);
    }
}

// SQL-Anweisung zum Erstellen der Datenbanktabelle (für die erste Einrichtung)
/*
CREATE TABLE highscores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    datum DATETIME NOT NULL
);
*/
?>