async function fetchLeaderboard() {
    try {
        const response = await fetch('php/get-leaderboard.php');
        if (!response.ok) throw new Error('Fehler beim Laden der Highscores.');

        const data = await response.json();
        renderLeaderboard(data);
    } catch (error) {
        console.error('Leaderboard error:', error.message);
        document.getElementById('leaderboard-list').innerHTML = `<li>Fehler beim Laden.</li>`;
    }
}

function renderLeaderboard(data) {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
        list.innerHTML = '<li>Keine Einträge vorhanden.</li>';
        return;
    }

    data.forEach((entry, index) => {
        const item = document.createElement('li');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <span class="rank">#${index + 1}</span>
            <span class="player-name">${entry.name}</span>
            <span class="player-score">${entry.score}</span>
        `;
        list.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLeaderboard();
});
