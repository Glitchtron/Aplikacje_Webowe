//Znajdowanie referencji do canvasu
const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");


const birdImg = new Image();
birdImg.src = 'FlappyAssets/yellowbird-midflap.png';

const bgImg = new Image();
bgImg.src = 'FlappyAssets/background-day.png';

const pipeImg = new Image();
pipeImg.src = 'FlappyAssets/pipe-green.png';

let bird = {x : 50, y : canvas.width / 2, width: 34, height: 34, gravity: 0.2, velocity: 0, jump_velocity: -5};
let pipes = [];
let pipeWidth = 52;
let pipeGap = 140;
let score = 0;
let jump = false;
let gameStarted = false;
let gameRunning = true;
document.addEventListener('keydown', keyDownHandler)

function keyDownHandler(e) {
    if (e.key === ' ') {
        jump = true;
        gameStarted = true;
    }
}
pipeInterval = setInterval(addPipes, 2000);
//Dodajemy ruryy
function addPipes(){
    let topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap,
        passed: false
    });
}

function updateBird(){
    if (!gameStarted){ return}
    if (jump){
        bird.velocity = bird.jump_velocity;
        jump = false;
    }
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= 2;

        // kolizje
        if (
            bird.x + bird.width > p.x &&
            bird.x < p.x + pipeWidth &&
            (bird.y < p.top || bird.y + bird.height > p.top + pipeGap)
        ) {
            resetGame();
        }

        if (!p.passed && bird.x > p.x + pipeWidth) {
            score++;
            p.passed = true;
        }
    }
    if(bird.y + bird.height > canvas.height || bird.y < 0){
        gameStarted = false;
        resetGame();
    }
}

function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    let angle = bird.velocity * 0.05;
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(angle);
    ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    ctx.restore();

    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];

        ctx.save();
        ctx.translate(p.x + pipeWidth / 2, p.top / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(pipeImg, -pipeWidth / 2, -p.top / 2, pipeWidth, p.top);
        ctx.restore();

        // --- Dolna rura ---
        ctx.drawImage(pipeImg, p.x, canvas.height - p.bottom, pipeWidth, p.bottom);
    }
}

function resetGame() {
    bird.y = 250;
    bird.velocity = 0;
    pipes = [];
    score = 0;
}

function gameLoop() {
    if (!gameRunning) return;
    updateBird();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
