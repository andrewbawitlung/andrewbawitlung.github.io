const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Get mouse position
let mouse = {
    x: null,
    y: null,
    radius: 100 // Distance the mouse affects particles
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Create Particle class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Check particle position, check mouse position, move particle, draw particle
    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse collision detection (Repulsion effect)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius + this.size){
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 2;
            }
        }
        
        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 12000; // Density
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5; // Minimalist size
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5; // Slow movement
        let directionY = (Math.random() * 1) - 0.5;
        let color = 'rgba(255, 255, 255, 0.6)'; // Subtle white

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect particles close to the mouse with a faint line
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        let dx = mouse.x - particlesArray[a].x;
        let dy = mouse.y - particlesArray[a].y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius) {
            let opacityValue = 1 - (distance/mouse.radius);
            ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue * 0.2 + ')'; // Very faint line
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Handle window resize
window.addEventListener('resize',
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    }
);

// Mouse out event to prevent particles getting stuck
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();
