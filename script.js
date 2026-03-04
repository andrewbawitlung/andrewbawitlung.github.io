const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Your library of math equations and symbols
const mathFormulas = [
    '∫ f(x) dx', '∑ x_i', 'e^{iπ} + 1 = 0', 'E = mc²', 
    '∇ × B = μ₀J', "f'(x)", 'lim_{x→0}', 'sin²θ + cos²θ = 1',
    'α', 'β', 'γ', 'Δ', '∞', '√x', 'A = πr²', 'd/dx'
];

// Get mouse position
let mouse = {
    x: null,
    y: null,
    radius: 100 // Distance the mouse affects formulas
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Create Particle class for text
class Particle {
    constructor(x, y, directionX, directionY, size, color, text) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size; // Used to scale font size
        this.color = color;
        this.text = text;
    }

    // Draw text formula
    draw() {
        ctx.font = `${this.size * 4}px 'Inter', sans-serif`; 
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x, this.y);
    }

    // Move and detect mouse collision
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
        
        let hitBox = this.size * 5; // Approximate bounding box for text
        
        if (distance < mouse.radius + hitBox){
            if (mouse.x < this.x && this.x < canvas.width - hitBox) {
                this.x += 2;
            }
            if (mouse.x > this.x && this.x > hitBox) {
                this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - hitBox) {
                this.y += 2;
            }
            if (mouse.y > this.y && this.y > hitBox) {
                this.y -= 2;
            }
        }
        
        // Move formula
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Initialize formulas array
function init() {
    particlesArray = [];
    // Lowered density slightly so the screen doesn't get too cluttered with text
    let numberOfParticles = (canvas.height * canvas.width) / 18000; 
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 2; // Font size scaling
        let x = (Math.random() * ((innerWidth - size * 5) - (size * 5)) + size * 5);
        let y = (Math.random() * ((innerHeight - size * 5) - (size * 5)) + size * 5);
        let directionX = (Math.random() * 1) - 0.5; 
        let directionY = (Math.random() * 1) - 0.5;
        let color = 'rgba(255, 255, 255, 0.7)'; // 70% opacity white for the math
        
        // Pick a random formula from the array
        let randomText = mathFormulas[Math.floor(Math.random() * mathFormulas.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color, randomText));
    }
}

// Connect formulas close to the mouse with a faint line
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        let dx = mouse.x - particlesArray[a].x;
        let dy = mouse.y - particlesArray[a].y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius) {
            let opacityValue = 1 - (distance/mouse.radius);
            ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue * 0.2 + ')'; 
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
window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    }
);

// Mouse out event to prevent formulas getting stuck
window.addEventListener('mouseout', function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();
