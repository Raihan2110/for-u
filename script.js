const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let floatingHearts = [];
let burstParticles = [];

const COLORS = ['#ff007f', '#ff1493', '#da70d6', '#8a2be2', '#9370db'];

function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function drawHeart(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;

    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    
    ctx.fill();
    ctx.restore();
}

class FloatingHeart {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.size = Math.random() * 15 + 5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = randomColor();
    }
    update() {
        this.y -= this.speedY;
        if (this.y < -50) this.reset();
    }
    draw() { drawHeart(ctx, this.x, this.y, this.size, this.color, this.opacity); }
}

class BurstParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 12 + 4;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = (Math.random() - 0.5) * 10;
        this.opacity = 1;
        this.color = randomColor();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;
    }
    draw() { drawHeart(ctx, this.x, this.y, this.size, this.color, this.opacity); }
}

// Fungsi memunculkan teks "I LOVE U IMOY"
function showImoyText(x, y) {
    const msg = document.createElement('div');
    msg.classList.add('love-msg');
    msg.innerText = 'I LOVE U IMOY'; 
    msg.style.left = `${x}px`;
    msg.style.top = `${y}px`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 1200);
}

function handleInteraction(e) {
    const x = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const y = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    for (let i = 0; i < 30; i++) burstParticles.push(new BurstParticle(x, y));
    showImoyText(x, y);
}

window.addEventListener('mousedown', handleInteraction);
window.addEventListener('touchstart', handleInteraction);

function init() {
    for (let i = 0; i < 40; i++) floatingHearts.push(new FloatingHeart());
}

function animate() {
    ctx.fillStyle = 'rgba(5, 0, 10, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    floatingHearts.forEach(h => { h.update(); h.draw(); });
    burstParticles.forEach((p, i) => {
        p.update(); p.draw();
        if (p.opacity <= 0) burstParticles.splice(i, 1);
    });
    requestAnimationFrame(animate);
}

init();
animate();