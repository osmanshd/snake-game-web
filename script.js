// define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highscoreText = document.getElementById('highScore');

// define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

// draw game map + snake + food
function draw() {
    board.innerHTML = '';       // resets the board everytime we draw
    drawSnake();
    drawFood();
    updateScore();
}

// draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// draw food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// create game elements (snake or food)
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// set position of game elements (snake or food)
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// generate random coordinate for food position
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

// moving the snake
function move() {
    const head = {...snake[0]};
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);
    
    // if we hit food, regenerate food element & increase speed & grow snake
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);    // clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }
}

// starting the game
function startGame() {
    gameStarted = true; 
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// keypress event listener (make the game interactive)
function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ')) {
        startGame();
    }
    else {
        if(event.key === 'ArrowUp' || event.key === 'w') {
            direction = 'up';
        }
        else if(event.key === 'ArrowDown' || event.key === 's') {
            direction = 'down';
        }
        else if(event.key === 'ArrowLeft' || event.key === 'a') {
            direction = 'left';
        }
        else if(event.key === 'ArrowRight' || event.key === 'd') {
            direction = 'right';
        }
    }
}

// manage snake speed, ensuring it does not get too fast
function increaseSpeed() {
    if (gameSpeedDelay > 150)
        gameSpeedDelay -= 5;
    else if (gameSpeedDelay > 100)
        gameSpeedDelay -= 3;
    else if (gameSpeedDelay > 50)
        gameSpeedDelay -= 2;
    else if (gameSpeedDelay > 25)
        gameSpeedDelay -= 1;
}

// reset game if snake collides with wall or itself
function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize)
        resetGame();

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y)
            resetGame();
    }
}

// reset game + update score & highscore + stop 
function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

// update game score
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// update highscore
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highscoreText.textContent = highScore.toString().padStart(3, '0');
    }    
    highscoreText.style.display = 'block';
}

// stop the game
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

// always listen to keyboard input
document.addEventListener('keydown', handleKeyPress);
