export class UIManager {
    constructor(scoreElementId, gameOverModalId) {
        this.scoreElement = document.getElementById(scoreElementId);
        this.modal = document.getElementById(gameOverModalId);
        this.finalScoreElement = this.modal.querySelector('#final-score');
        this.nameInput = this.modal.querySelector('#player-name');
        this.submitButton = this.modal.querySelector('#submit-score-btn');
        this.closeButton = this.modal.querySelector('#close-modal-btn');
    }

    updateScore(score) {
        if (this.scoreElement) {
            this.scoreElement.textContent = `Score: ${score}`;
        }
    }

    showGameOver(score) {
        if (!this.modal) return;
        this.finalScoreElement.textContent = score;
        this.nameInput.value = '';
        this.modal.classList.remove('hidden');
    }

    hideGameOver() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }

    async submitScore(score) {
        const name = this.nameInput.value.trim() || 'Anonymous';
        try {
            const response = await fetch('php/save-score.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, score })
            });

            if (!response.ok) {
                throw new Error('Failed to save score.');
            }

            const result = await response.json();
            if (result.status !== 'success') {
                throw new Error(result.message || 'Unknown error');
            }

            window.location.href = 'leaderboard.html';

        } catch (error) {
            console.error('Score submission error:', error.message);
            alert('Fehler beim Speichern des Scores.');
        }
    }

    bindEvents(score, onSubmit) {
        this.submitButton.addEventListener('click', () => {
            this.submitScore(score);
        });

        this.closeButton.addEventListener('click', () => {
            this.hideGameOver();
        });
    }
}
