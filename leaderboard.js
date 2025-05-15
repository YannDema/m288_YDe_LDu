// Leaderboard-Funktionen
const leaderboardBody = document.getElementById('leaderboard-body');

// Leaderboard aus lokalen Daten laden
function ladeLeaderboard() {
    // Aus localStorage laden (für lokale Entwicklung)
    const highscores = JSON.parse(localStorage.getItem('dinoHighscores') || '[]');
    
    // Leaderboard leeren
    leaderboardBody.innerHTML = '';
    
    // Keine Highscores vorhanden
    if (highscores.length === 0) {
        const leereZeile = document.createElement('tr');
        leereZeile.innerHTML = '<td colspan="3" style="text-align: center;">Noch keine Highscores vorhanden</td>';
        leaderboardBody.appendChild(leereZeile);
        return;
    }
    
    // Highscores anzeigen
    highscores.forEach((score, index) => {
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
}

// Alternativ: Leaderboard vom Server laden
function ladeLeaderboardVomServer() {
    // In einer echten Implementierung: AJAX-Anfrage an den Server
    // fetch('/api/leaderboard')
    //    .then(response => response.json())
    //    .then(data => {
    //        // Highscores anzeigen
    //        // ...
    //    })
    //    .catch(error => {
    //        console.error('Fehler beim Laden des Leaderboards:', error);
    //    });
}

// Highscore an den Server senden
function sendHighscoreToServer(highscoreDaten) {
    // In einer echten Implementierung: AJAX-Anfrage an den Server
    // fetch('/api/highscore', {
    //    method: 'POST',
    //    headers: {
    //        'Content-Type': 'application/json',
    //    },
    //    body: JSON.stringify(highscoreDaten),
    // })
    // .then(response => response.json())
    // .then(data => {
    //    console.log('Highscore erfolgreich gespeichert:', data);
    // })
    // .catch(error => {
    //    console.error('Fehler beim Speichern des Highscores:', error);
    // });
}