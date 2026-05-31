const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreLabel = document.getElementById('scoreLabel');
const speedLabel = document.getElementById('speedLabel');
const restartButton = document.getElementById('restartButton');

const width = canvas.width;
const height = canvas.height;

const player = {
  x: width / 4,
  y: height / 2,
  size: 24,
  speed: 4,
  dx: 0,
  dy: 0,
};

const enemy = {
  x: (width / 4) * 3,
  y: height / 2,
  size: 28,
  speed: 1,
};

let score = 0;
let elapsed = 0;
let gameOver = false;
let lastTime = 0;

function resetGame() {
  player.x = width / 4;
  player.y = height / 2;
  player.dx = 0;
  player.dy = 0;
  enemy.x = (width / 4) * 3;
  enemy.y = height / 2;
  enemy.speed = 1;
  score = 0;
  elapsed = 0;
  gameOver = false;
  scoreLabel.textContent = 'Skor: 0';
  speedLabel.textContent = 'Kecepatan musuh: 1.0';
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function update(delta) {
  if (gameOver) return;

  player.x += player.dx * player.speed;
  player.y += player.dy * player.speed;
  player.x = Math.max(player.size / 2, Math.min(width - player.size / 2, player.x));
  player.y = Math.max(player.size / 2, Math.min(height - player.size / 2, player.y));

  const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
  enemy.x += Math.cos(angle) * enemy.speed;
  enemy.y += Math.sin(angle) * enemy.speed;

  elapsed += delta;
  if (elapsed >= 1000) {
    elapsed -= 1000;
    score += 1;
    if (score % 5 === 0) {
      enemy.speed = Math.min(5, enemy.speed + 0.2);
      speedLabel.textContent = `Kecepatan musuh: ${enemy.speed.toFixed(1)}`;
    }
    scoreLabel.textContent = `Skor: ${score}`;
  }

  const distX = Math.abs(player.x - enemy.x);
  const distY = Math.abs(player.y - enemy.y);
  const minDist = (player.size + enemy.size) / 2;

  if (distX < minDist && distY < minDist) {
    gameOver = true;
  }
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  drawGrid();

  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size);

  if (gameOver) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, height / 2 - 48, width, 96);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 28px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', width / 2, height / 2 - 4);
    ctx.font = '18px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText(`Skor akhir: ${score}`, width / 2, height / 2 + 24);
  }
}

function loop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;
  update(delta);
  draw();
  if (!gameOver) {
    requestAnimationFrame(loop);
  }
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') player.dy = -1;
  if (event.key === 'ArrowDown') player.dy = 1;
  if (event.key === 'ArrowLeft') player.dx = -1;
  if (event.key === 'ArrowRight') player.dx = 1;
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') player.dy = 0;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') player.dx = 0;
});

restartButton.addEventListener('click', resetGame);

resetGame();
