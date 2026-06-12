const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let isDarkMode = false;

// Dark Mode Toggle Logic
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
toggleSwitch.addEventListener('change', function(e) {
    isDarkMode = e.target.checked;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Smoothly update existing particles
    particlesArray.forEach(p => {
        if (p.color !== '#FF9F43') {
            p.color = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.15)';
        }
    });
});

// Get mouse position
let mouse = {
    x: null,
    y: null,
    radius: 180 // Distance for interaction
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
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    // Draw particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
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

        // Mouse interaction (Repel effect)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/20; // Return speed
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/20;
            }
        }
        
        // Natural movement
        this.baseX += this.directionX;
        this.baseY += this.directionY;
        
        // Edge wrapping for base positions
        if(this.baseX > canvas.width + 100) this.baseX = -100;
        if(this.baseX < -100) this.baseX = canvas.width + 100;
        if(this.baseY > canvas.height + 100) this.baseY = -100;
        if(this.baseY < -100) this.baseY = canvas.height + 100;
        
        this.draw();
    }
}

// Initialize particles array
function init() {
    particlesArray = [];
    // Adjust density based on screen size
    let numberOfParticles = (canvas.height * canvas.width) / 9000; 
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5; // Very small dots
        let x = (Math.random() * innerWidth);
        let y = (Math.random() * innerHeight);
        let directionX = (Math.random() * 0.4) - 0.2; 
        let directionY = (Math.random() * 0.4) - 0.2;
        
        // Theme colors: respond to dark mode dynamically
        let baseColor = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.15)';
        let color = Math.random() > 0.85 ? '#FF9F43' : baseColor;

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect particles
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            // Connection distance
            if (distance < (canvas.width/9) * (canvas.height/9)) {
                opacityValue = 1 - (distance/15000);
                
                // Subtle connecting lines, picking up the orange if it's an orange node
                let colorBase = particlesArray[a].color === '#FF9F43' || particlesArray[b].color === '#FF9F43' 
                    ? `rgba(255, 159, 67, ${opacityValue * 0.3})` 
                    : (isDarkMode ? `rgba(255, 255, 255, ${opacityValue * 0.1})` : `rgba(0, 0, 0, ${opacityValue * 0.08})`);
                
                ctx.strokeStyle = colorBase;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
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

// Mouse out event
window.addEventListener('mouseout', function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();
