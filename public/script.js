const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer;
let seconds = 0;

// Number set (18 unique numbers for matching pairs)
const numbers = Array.from({ length: 18 }, (_, i) => i + 1);

// Initialize the game
function initializeGame() {
    generateCards();
    renderCards();
    startTimer();
}

function generateCards() {
    const pairs = [...numbers]; // clone the array for pairs
    cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5); // duplicate and shuffle
}

function renderCards() {
    gameBoard.innerHTML = '';
    cards.forEach((number, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        // Create front and back faces of the card
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = number; // Assign the number to the front

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '❓'; // Back face shows a question mark

        // Add front and back to inner card element
        cardInner.appendChild(cardBack); // Question mark side initially visible
        cardInner.appendChild(cardFront); // Number side hidden initially
        cardElement.appendChild(cardInner);

        // Add flip functionality
        cardElement.addEventListener('click', () => flipCard(cardElement, index));

        // Append the card to the game board
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(cardElement, index) {
    if (flippedCards.length < 2 && !cardElement.classList.contains('matched')) {
        cardElement.classList.add('flipped');
        flippedCards.push({ element: cardElement, value: cards[index], index });

        // Check for a match if two cards are flipped
        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 800);
        }
    }
}

function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.value === secondCard.value) {
        firstCard.element.classList.add('matched');
        secondCard.element.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === 18) {
            clearInterval(timer);
            alert(`Congratulations! You won in ${seconds} seconds.`);
            saveScore(seconds);
        }
    } else {
        firstCard.element.classList.remove('flipped');
        secondCard.element.classList.remove('flipped');
    }
    flippedCards = [];
}

function startTimer() {
    seconds = 0;
    timerElement.textContent = 'Time: 00:00';
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

function saveScore(time) {
    const username = prompt('New high score! Enter your name:');
    if (username) {
        fetch('/submit-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, time })
        }).then(() => location.reload());
    }
}

resetButton.addEventListener('click', () => {
    matchedPairs = 0;
    flippedCards = [];
    initializeGame();
});

initializeGame();