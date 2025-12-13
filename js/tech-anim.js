const canvas = document.getElementById('tech-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 100;
const connectionDistance = 150;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'; // Cyan or Purple
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function init() {
    resize();
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();

        // Connect particles
        for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(100, 100, 100, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
init();
animate();

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Menu Toggle Logic
const menuToggle = document.querySelector('.menu-toggle');
const overlayMenu = document.querySelector('.overlay-menu');

if (menuToggle && overlayMenu) {
    menuToggle.addEventListener('click', () => {
        overlayMenu.classList.toggle('active');
        // Animate hamburger lines
        const spans = menuToggle.querySelectorAll('span');
        if (overlayMenu.classList.contains('active')) {
            spans[0].style.transform = 'translate(0px, 9px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translate(0px, -9px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Lightbox Logic
const thesisImages = document.querySelectorAll('.thesis-container img');
if (thesisImages.length > 0) {
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    document.body.appendChild(lightbox);

    const lightboxImg = document.createElement('img');
    lightbox.appendChild(lightboxImg);

    // Open lightbox
    thesisImages.forEach(img => {
        img.addEventListener('click', e => {
            lightboxImg.src = e.target.src;
            lightboxImg.alt = e.target.alt;
            lightbox.classList.add('active');
        });
    });

    // Close lightbox
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
}

// Project HUD Logic
function openHUD(card) {
    const hud = document.getElementById('project-hud');
    const hudContent = document.querySelector('.hud-content');

    // Extract data
    const title = card.querySelector('h4').innerText;
    const date = card.querySelector('.date').innerText;
    // Get media: either iframe or img. We clone it to preserve attributes.
    const mediaContainer = card.querySelector('.media-container');
    let mediaHTML = '';
    if (mediaContainer) {
        mediaHTML = mediaContainer.innerHTML;
    } else {
        // Fallback for older card structure if any
        const iframe = card.querySelector('iframe');
        const img = card.querySelector('img');
        if (iframe) mediaHTML = `<iframe src="${iframe.src}" title="Project Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
        if (img) mediaHTML = `<img src="${img.src}" alt="${img.alt}" style="width:100%; border-radius:4px;">`;
    }

    const desc = card.querySelector('p').innerText;
    const linksDiv = card.querySelector('.project-links');
    const linksHTML = linksDiv ? linksDiv.innerHTML : '';

    // Populate HUD
    document.getElementById('hud-title').innerText = title;
    document.getElementById('hud-date').innerText = date;
    document.getElementById('hud-media').innerHTML = mediaHTML;
    document.getElementById('hud-desc').innerText = desc;
    document.getElementById('hud-links').innerHTML = linksHTML;

    // Show HUD
    hud.style.display = 'flex';
    // Trigger reflow
    void hud.offsetWidth;
    hud.classList.add('active');

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
}

function closeHUD() {
    const hud = document.getElementById('project-hud');
    hud.classList.remove('active');

    // Unlock body scroll
    document.body.style.overflow = '';
    document.body.style.height = '';

    setTimeout(() => {
        hud.style.display = 'none';
        document.getElementById('hud-media').innerHTML = ''; // Clear media to stop video playback
    }, 300);
}

// Attach to window for global access if needed, or rely on onclick attributes
window.openHUD = openHUD;
window.closeHUD = closeHUD;

// Typing Animation
document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typing-text');
    if (textElement) {
        const textToType = "Technology | Basketball | Calligraphy | Music";
        let index = 0;

        function typeWriter() {
            if (index < textToType.length) {
                textElement.innerHTML += textToType.charAt(index);
                index++;
                setTimeout(typeWriter, 100); // Typing speed
            }
        }

        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }
});

// Close on background click
document.getElementById('project-hud')?.addEventListener('click', (e) => {
    if (e.target.id === 'project-hud') {
        closeHUD();
    }
});
