const WEDDING_DATE = new Date('2026-12-27T18:00:00').getTime();
const NOIVO_WHATSAPP = '5500000000000';
const NOIVA_WHATSAPP = '5500000000001';

const envelopeScreen = document.getElementById('envelopeScreen');
const envelopeBtn = document.getElementById('envelopeBtn');
const conviteContent = document.getElementById('conviteContent');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicButton = document.querySelector('.music-button');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const slides = [...document.querySelectorAll('.carousel-slide')];
const dots = [...document.querySelectorAll('.dot')];

let currentSlide = 0;
let carouselInterval;
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class OliveLeaf {
  constructor() {
    this.x = canvas.width * (0.25 + Math.random() * 0.5);
    this.y = canvas.height * (0.42 + Math.random() * 0.12);
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = -(Math.random() * 1.8 + 0.8);
    this.size = Math.random() * 8 + 8;
    this.rotation = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.035;
    this.opacity = 1;
    this.life = 0;
    this.maxLife = Math.random() * 35 + 55;
    this.color = ['#6f7d5c', '#879574', '#aeb99a', '#b8985b'][Math.floor(Math.random() * 4)];
  }

  update() {
    this.x += this.vx + Math.sin(this.life / 9) * 0.35;
    this.y += this.vy;
    this.vy -= 0.004;
    this.rotation += this.spin;
    this.life++;
    this.opacity = Math.max(0, 1 - this.life / this.maxLife);
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.42, this.size, 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -this.size * 0.8);
    ctx.lineTo(0, this.size * 0.8);
    ctx.strokeStyle = '#d8c27d';
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.restore();
  }
}

class GoldenGlow {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height * 0.42;
    this.radius = 18;
    this.opacity = 0.6;
    this.life = 0;
    this.maxLife = 35;
  }

  update() {
    this.radius += 2.8;
    this.opacity -= 0.018;
    this.life++;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    const gradient = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, this.radius);
    gradient.addColorStop(0, '#f5df9d');
    gradient.addColorStop(0.35, 'rgba(184,152,91,.4)');
    gradient.addColorStop(1, 'rgba(184,152,91,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createOpeningAnimation() {
  particles = [new GoldenGlow()];
  for (let i = 0; i < 18; i++) particles.push(new OliveLeaf());
  animateOpening();
}

function animateOpening() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.opacity > 0 && p.life < p.maxLife);
  particles.forEach(p => { p.update(); p.draw(); });
  if (particles.length) requestAnimationFrame(animateOpening);
}

function updateCountdown() {
  const diff = WEDDING_DATE - Date.now();
  const values = diff <= 0 ? [0, 0, 0, 0] : [
    Math.floor(diff / 86400000),
    Math.floor((diff % 86400000) / 3600000),
    Math.floor((diff % 3600000) / 60000),
    Math.floor((diff % 60000) / 1000)
  ];
  [daysEl, hoursEl, minutesEl, secondsEl].forEach((element, index) => {
    element.textContent = String(values[index]).padStart(2, '0');
  });
}

function showSlide(index) {
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  currentSlide = index;
}

function startCarousel() {
  showSlide(currentSlide);
  clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    showSlide((currentSlide + 1) % slides.length);
  }, 4000);
}

function toggleMusic() {
  if (!backgroundMusic) return;
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
    musicButton.textContent = '♫';
  } else {
    backgroundMusic.pause();
    musicButton.textContent = '×';
  }
}

function openEnvelope() {
  envelopeBtn.classList.add('clicked');
  createOpeningAnimation();
  if (backgroundMusic) {
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch(() => {});
  }
  setTimeout(() => {
    envelopeScreen.classList.add('hidden');
    conviteContent.classList.remove('hidden');
    startCarousel();
  }, 700);
}

envelopeBtn.addEventListener('click', openEnvelope);
if (musicButton) musicButton.addEventListener('click', toggleMusic);

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    startCarousel();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  const links = document.querySelectorAll('a[href*="wa.me"]');
  links.forEach((link, index) => {
    const number = index === 0 ? NOIVO_WHATSAPP : NOIVA_WHATSAPP;
    const message = encodeURIComponent('Olá! Confirmo minha presença no casamento de Fransuilame e Samara.');
    link.href = `https://wa.me/${number}?text=${message}`;
  } );
});
