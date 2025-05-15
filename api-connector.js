// API-Funktionen für die Kommunikation mit dem PHP-Backend
const API_URL = 'api.php';

// Highscore an das PHP-Backend senden
function sendeHighscoreAnServer(highscoreDaten) {
    return fetch(`${API_URL}?action=speichern`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(highscoreDaten)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        return response.json();
    });
}

// Leaderboard vom PHP-Backend laden
function ladeLeaderboardVomServer() {
    return fetch(`${API_URL}?action=laden`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        return response.json();
    });
}

// Frontend mit Backend-Daten aktualisieren
function aktualisiereLeaderboardMitServerDaten() {
    // Leaderboard-Container auswählen
    const leaderboardBody = document.getElementById('leaderboard-body');
    
    // Leaderboard leeren
    leaderboardBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Lade Leaderboard...</td></tr>';
    
    // Daten vom Server laden
    ladeLeaderboardVomServer()
        .then(data => {
            if (!data.success || !data.highscores || data.highscores.length === 0) {
                leaderboardBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Noch keine Highscores vorhanden</td></tr>';
                return;
            }
            
            // Leaderboard leeren
            leaderboardBody.innerHTML = '';
            
            // Highscores anzeigen
            data.highscores.forEach((score, index) => {
                const zeile = document.createElement('tr');
                
                // Platzierung
                const platzZelle = document.createElement('td');
                platzZelle.textContent = index + 1;
                zeile.appendChild(platzZelle);
                
                // Username
                const usernameZelle = document.createElement('td');
                usernameZelle.textContent = score.username;
                zeile.appendChild(usernameZelle);
                
                // Punktzahl
                const punkteZelle = document.createElement('td');
                punkteZelle.textContent = score.score;
                zeile.appendChild(punkteZelle);
                
                leaderboardBody.appendChild(zeile);
            });
        })
        .catch(error => {
            console.error('Fehler beim Laden des Leaderboards:', error);
            leaderboardBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Fehler beim Laden des Leaderboards</td></tr>';
            
            // Als Fallback lokale Daten verwenden
            setTimeout(() => {
                ladeLeaderboard();
            }, 1000);
        });
}

// Highscore speichern (überschreibt die lokale Version in game.js)
function speichereHighscoreMitServer(punktzahl) {
    // Prüfen, ob ein Username vorhanden ist
    if (!username || username.trim() === '') {
        console.warn('Kein Username zum Speichern des Highscores verfügbar');
        return;
    }
    
    // Highscore-Daten vorbereiten
    const highscoreDaten = {
        username: username,
        score: punktzahl
    };
    
    // An den Server senden
    sendeHighscoreAnServer(highscoreDaten)
        .then(data => {
            console.log('Highscore erfolgreich gespeichert:', data);
            
            // Lokalen Highscore auch speichern (als Fallback)
            speichereHighscore(punktzahl);
        })
        .catch(error => {
            console.error('Fehler beim Speichern des Highscores auf dem Server:', error);
            
            // Als Fallback lokal speichern
            speichereHighscore(punktzahl);
        });
}

// Event-Listener für das Laden des Leaderboards
const leaderboardLink = document.getElementById('leaderboard-link');
leaderboardLink.addEventListener('click', function(event) {
    event.preventDefault();
    
    // Ansicht wechseln
    window.DinoGame.zeigeLeaderboard();
    
    // Versuchen, das Leaderboard vom Server zu laden
    try {
        aktualisiereLeaderboardMitServerDaten();
    } catch (error) {
        // Fallback: Lokale Daten verwenden
        ladeLeaderboard();
    }
});