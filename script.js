const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 50, y: 300, width: 30, height: 30, color: 'blue' };
let books = [];
let score = 0;
let timeLeft = 30;
let timerInterval;

// Cargar la imagen de fondo
const backgroundImage = new Image();
backgroundImage.src = 'images/libro.png';

// Generar libros en posiciones aleatorias
function generateBooks(num) {
    for (let i = 0; i < num; i++) {
        const book = {
            x: Math.random() * (canvas.width - 20),
            y: Math.random() * (canvas.height - 20),
            width: 20,
            height: 20,
            collected: false,
            special: Math.random() < 0.3 // 30% de probabilidad de ser un libro especial
        };
        books.push(book);
    }
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBooks() {
    books.forEach(book => {
        if (!book.collected) {
            ctx.fillStyle = book.special ? 'gold' : 'red'; // Libros especiales en dorado
            ctx.fillRect(book.x, book.y, book.width, book.height);
        }
    });
}

function updateScore() {
    document.getElementById('score').innerText = `Puntuación: ${score}`;
}

function updateTimer() {
    document.getElementById('timer').innerText = `Tiempo: ${timeLeft}`;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (books.every(book => book.collected)) {
            alert("¡Agarraste todos los libros!");
        } else {
            alert(`¡Tiempo agotado! Puntuación final: ${score}`);
        }
        resetGame();
    }
    timeLeft--;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(); // Dibuja el fondo
    drawPlayer();
    drawBooks();
    updateScore();
}

function collectBook() {
    books.forEach(book => {
        if (!book.collected && isColliding(player, book)) {
            book.collected = true;
            score++;

            // Aumentar puntos si es un libro especial
            if (book.special) score += 2;

            document.getElementById('collectSound').play(); // Sonido al recoger libro
        }
    });
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        player.x = Math.min(canvas.width - player.width, player.x + 5); // Limitar movimiento a la derecha
    } else if (event.key === 'ArrowLeft') {
        player.x = Math.max(0, player.x - 5); // Limitar movimiento a la izquierda
    } else if (event.key === 'ArrowUp') {
        player.y = Math.max(0, player.y - 5); // Limitar movimiento hacia arriba
    } else if (event.key === 'ArrowDown') {
        player.y = Math.min(canvas.height - player.height, player.y + 5); // Limitar movimiento hacia abajo
    }
    
    collectBook(); // Comprobar si se recogen libros
});

function resetGame() {
    score = 0;
    timeLeft = 30;
    books = [];
    
    generateBooks(5); // Generar nuevos libros

    updateScore();
    
    timerInterval = setInterval(updateTimer, 1000); // Reiniciar temporizador

    // Iniciar el bucle de actualización del juego
    requestAnimationFrame(function gameLoop() {
        update();
        requestAnimationFrame(gameLoop);
    });
}

// Inicializar el juego
backgroundImage.onload = resetGame; // Iniciar el juego cuando la imagen esté cargada
