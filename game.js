// Spielvariablen
let spielLäuft = false;
let score = 0;
let highScore = 0;
let istTagModus = true;
let tagNachtZyklusTimer = null;
let hindernisse = [];
let bewegungsIntervall = null;
let geschwindigkeit = 5;
let sprungHöhe = 0;
let isJumping = false;
let isDucking = false;
let username = '';

// DOM-Elemente
const spielContainer = document.getElementById('spiel');
const dinoElement = document.getElementById('dino');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverElement = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const spielenLink = document.getElementById('spielen-link');
const leaderboardLink = document.getElementById('leaderboard-link');
const spielContainer2 = document.getElementById('spiel-container');
const leaderboardContainer = document.getElementById('leaderboard-container');
const usernameModal = document.getElementById('username-modal');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');

// Event-Listener
document.addEventListener('DOMContentLoaded', zeigeUsernameModal);
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
spielenLink.addEventListener('click', zeigeSpiel);
leaderboardLink.addEventListener('click', zeigeLeaderboard);
usernameForm.addEventListener('submit', speichereUsername);

// Username-Modal anzeigen
function zeigeUsernameModal(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Prüfen, ob bereits ein Username im localStorage gespeichert ist
    const gespeicherterUsername = localStorage.getItem('dinoUsername');
    if (gespeicherterUsername) {
        username = gespeicherterUsername;
        usernameModal.style.display = 'none';
    } else {
        usernameModal.style.display = 'block';
    }
}

// Username speichern
function speichereUsername(event) {
    event.preventDefault();
    username = usernameInput.value.trim();
    
    if (username.length > 0) {
        localStorage.setItem('dinoUsername', username);
        usernameModal.style.display = 'none';
    }
}

// Zwischen Spiel und Leaderboard wechseln
function zeigeSpiel(event) {
    if (event) {
        event.preventDefault();
    }
    spielContainer2.style.display = 'flex';
    leaderboardContainer.style.display = 'none';
    spielenLink.classList.add('active');
    leaderboardLink.classList.remove('active');
}

function zeigeLeaderboard(event) {
    if (event) {
        event.preventDefault();
    }
    spielContainer2.style.display = 'none';
    leaderboardContainer.style.display = 'block';
    spielenLink.classList.remove('active');
    leaderboardLink.classList.add('active');
    
    // Leaderboard aktualisieren
    ladeLeaderboard();
}

// Spiel starten
function startGame() {
    if (spielLäuft) return;
    
    // Spiel zurücksetzen
    resetGame();
    
    // Spiel starten
    spielLäuft = true;
    startButton.textContent = 'Neustart';
    gameOverElement.style.display = 'none';
    
    // Tag-/Nacht-Zyklus starten
    startTagNachtZyklus();
    
    // Bewegungen starten
    bewegungsIntervall = setInterval(bewegeAlles, 16); // ca. 60 FPS
    
    // Hindernisse generieren
    erzeugeHindernisse();
}

// Spiel zurücksetzen
function resetGame() {
    // Hindernisse entfernen
    hindernisse.forEach(hindernis => {
        if (hindernis.element && hindernis.element.parentNode) {
            hindernis.element.parentNode.removeChild(hindernis.element);
        }
    });
    
    hindernisse = [];
    score = 0;
    scoreElement.textContent = score;
    geschwindigkeit = 5;
    sprungHöhe = 0;
    isJumping = false;
    isDucking = false;
    dinoElement.style.bottom = '0px';
    dinoElement.classList.remove('ducking');
    
    // Eventuell vorhandene Intervalle löschen
    if (bewegungsIntervall) {
        clearInterval(bewegungsIntervall);
    }
}

// Tag-/Nacht-Zyklus
function startTagNachtZyklus() {
    if (tagNachtZyklusTimer) {
        clearInterval(tagNachtZyklusTimer);
    }
    
    tagNachtZyklusTimer = setInterval(() => {
        istTagModus = !istTagModus;
        
        if (istTagModus) {
            spielContainer.classList.remove('nacht');
            spielContainer.classList.add('tag');
        } else {
            spielContainer.classList.remove('tag');
            spielContainer.classList.add('nacht');
        }
    }, 30000); // Alle 30 Sekunden wechseln
}

// Tastatureingaben verarbeiten
function handleKeyDown(event) {
    if (!spielLäuft) {
        if (event.code === 'Space' && gameOverElement.style.display === 'block') {
            startGame();
        }
        return;
    }
    
    if ((event.code === 'Space' || event.code === 'ArrowUp') && !isJumping) {
        springen();
    } else if (event.code === 'ArrowDown') {
        ducken(true);
    }
}

function handleKeyUp(event) {
    if (!spielLäuft) return;
    
    if (event.code === 'ArrowDown') {
        ducken(false);
    }
}

// Springen
function springen() {
    if (isJumping) return;
    
    isJumping = true;
    let jumpCount = 0;
    let jumpInterval = setInterval(() => {
        jumpCount++;
        
        // Aufwärtsbewegung
        if (jumpCount < 15) {
            sprungHöhe += 5;
        } 
        // Abwärtsbewegung
        else if (jumpCount >= 15) {
            sprungHöhe -= 5;
        }
        
        // Sprung beenden
        if (sprungHöhe <= 0) {
            clearInterval(jumpInterval);
            sprungHöhe = 0;
            isJumping = false;
        }
        
        dinoElement.style.bottom = sprungHöhe + 'px';
    }, 20);
}

// Ducken
function ducken(ducken) {
    isDucking = ducken;
    
    if (ducken) {
        dinoElement.classList.add('ducking');
    } else {
        dinoElement.classList.remove('ducking');
    }
}

// Hindernisse erzeugen
function erzeugeHindernisse() {
    if (!spielLäuft) return;
    
    // Zufälligen Typ wählen
    const hindernisTypen = ['kaktus', 'kaktus-gross', 'vogel'];
    const zufallsTyp = hindernisTypen[Math.floor(Math.random() * hindernisTypen.length)];
    
    // Hindernis-Element erstellen
    const hindernisElement = document.createElement('div');
    hindernisElement.className = 'hindernis ' + zufallsTyp;
    spielContainer.appendChild(hindernisElement);
    
    // Position festlegen
    const hindernis = {
        element: hindernisElement,
        x: spielContainer.offsetWidth,
        width: hindernisElement.offsetWidth,
        height: hindernisElement.offsetHeight,
        removed: false
    };
    
    hindernisElement.style.left = hindernis.x + 'px';
    hindernisse.push(hindernis);
    
    // Nächstes Hindernis in zufälligem Zeitabstand
    const minZeit = Math.max(1000, 2000 - score / 10);
    const maxZeit = Math.max(2000, 3500 - score / 10);
    const nextTime = Math.random() * (maxZeit - minZeit) + minZeit;
    
    setTimeout(() => {
        if (spielLäuft) {
            erzeugeHindernisse();
        }
    }, nextTime);
}

// Alle Elemente bewegen
function bewegeAlles() {
    if (!spielLäuft) return;
    
    // Score erhöhen
    score++;
    scoreElement.textContent = score;
    
    // Highscore aktualisieren
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = 'HI: ' + highScore;
    }
    
    // Geschwindigkeit erhöhen
    if (score % 100 === 0) {
        geschwindigkeit += 0.1;
    }
    
    // Hindernisse bewegen
    hindernisse.forEach((hindernis, index) => {
        if (!hindernis.removed) {
            hindernis.x -= geschwindigkeit;
            hindernis.element.style.left = hindernis.x + 'px';
            
            // Hindernis entfernen, wenn es außerhalb des Bildschirms ist
            if (hindernis.x + hindernis.width < 0) {
                spielContainer.removeChild(hindernis.element);
                hindernis.removed = true;
            }
            
            // Kollisionserkennung
            if (checkCollision(hindernis)) {
                gameOver();
            }
        }
    });
    
    // Hindernisse bereinigen
    hindernisse = hindernisse.filter(hindernis => !hindernis.removed);
}

// Kollisionserkennung
function checkCollision(hindernis) {
    const dinoRect = {
        x: 50,
        y: sprungHöhe,
        width: isDucking ? 60 : 40,
        height: isDucking ? 30 : 60
    };
    
    const hindernisRect = {
        x: hindernis.x,
        y: hindernis.element.offsetTop,
        width: hindernis.width,
        height: hindernis.height
    };
    
    // Prüfen, ob sich die Rechtecke überschneiden
    return !(
        dinoRect.x + dinoRect.width < hindernisRect.x ||
        dinoRect.x > hindernisRect.x + hindernisRect.width ||
        dinoRect.y + dinoRect.height < hindernisRect.y ||
        dinoRect.y > hindernisRect.y + hindernisRect.height
    );
}

// Game Over
function gameOver() {
    spielLäuft = false;
    clearInterval(bewegungsIntervall);
    clearInterval(tagNachtZyklusTimer);
    
    gameOverElement.style.display = 'block';
    startButton.textContent = 'Neues Spiel';
    
    // Highscore speichern
    speichereHighscore(score);
}

// Highscore speichern (verwendet in leaderboard.js)
function speichereHighscore(punktzahl) {
    // Prüfen, ob ein Username vorhanden ist
    if (!username || username.trim() === '') {
        console.warn('Kein Username zum Speichern des Highscores verfügbar');
        return;
    }
    
    // An den Server senden (simuliert für lokale Entwicklung)
    const highscoreDaten = {
        username: username,
        score: punktzahl,
        timestamp: new Date().toISOString()
    };
    
    // Highscore lokal speichern (für lokale Entwicklung)
    const highscores = JSON.parse(localStorage.getItem('dinoHighscores') || '[]');
    highscores.push(highscoreDaten);
    
    // Nach Punktzahl sortieren (höchste zuerst)
    highscores.sort((a, b) => b.score - a.score);
    
    // Maximal 10 Highscores speichern
    const topHighscores = highscores.slice(0, 10);
    localStorage.setItem('dinoHighscores', JSON.stringify(topHighscores));
    
    // In einer echten Implementierung: AJAX-Anfrage an den Server
    // sendHighscoreToServer(highscoreDaten);
}

// Export für andere Module
window.DinoGame = {
    speichereHighscore,
    zeigeLeaderboard,
    zeigeSpiel
};