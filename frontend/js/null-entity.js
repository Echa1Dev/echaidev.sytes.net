/**
 * Null Entity - Enhanced AI Companion
 * Comportamiento inteligente tipo Desktop Goose pero no molesto
 */

class NullEntity {
    constructor() {
        this.position = { x: window.innerWidth - 80, y: 80 };
        this.targetPosition = { x: window.innerWidth - 80, y: 80 };
        this.velocity = { x: 0, y: 0 };
        this.mousePosition = { x: 0, y: 0 };
        this.lastMouseMove = Date.now();
        this.lastUserActivity = Date.now();
        
        this.state = 'idle'; // idle, curious, following, inspecting, hiding
        this.lastStateChange = Date.now();
        this.personality = {
            curiosity: 0.7,
            shyness: 0.3,
            playfulness: 0.5
        };
        
        this.interestPoints = [];
        this.currentTarget = null;
        this.lastInteraction = 0;
        
        this.element = document.getElementById('theCore');
        this.cursor = document.getElementById('cursor');
        
        this.init();
    }

    init() {
        if (!this.element) return;
        
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
        
        this.setupEventListeners();
        this.identifyInterestPoints();
        this.startBehaviorLoop();
        
        // Make visible after a short delay
        setTimeout(() => {
            this.element.style.opacity = '0.6';
            this.element.style.transition = 'all 0.5s ease';
        }, 1000);
    }

    setupEventListeners() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.lastMouseMove = Date.now();
            this.lastUserActivity = Date.now();
            
            // Update cursor
            if (this.cursor) {
                this.cursor.style.left = e.clientX - 10 + 'px';
                this.cursor.style.top = e.clientY - 10 + 'px';
            }
        });

        // Track clicks
        document.addEventListener('click', (e) => {
            this.lastUserActivity = Date.now();
            this.reactToClick(e.clientX, e.clientY);
        });

        // Track scrolling
        document.addEventListener('scroll', () => {
            this.lastUserActivity = Date.now();
            this.reactToScroll();
        });

        // Track hover on important elements
        this.setupElementHoverTracking();
    }

    setupElementHoverTracking() {
        const importantElements = document.querySelectorAll('a, button, .skill-tag, .project-card, .window-header');
        
        importantElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.reactToElementHover(e.target);
            });
        });
    }

    identifyInterestPoints() {
        this.interestPoints = [
            // Navigation corners
            { x: 100, y: 120, type: 'nav', interest: 0.8 },
            { x: window.innerWidth - 100, y: 120, type: 'nav', interest: 0.8 },
            
            // Project section corners
            { x: 80, y: window.innerHeight * 0.6, type: 'content', interest: 0.9 },
            { x: window.innerWidth - 80, y: window.innerHeight * 0.6, type: 'content', interest: 0.9 },
            
            // Footer area
            { x: window.innerWidth / 2, y: window.innerHeight - 120, type: 'footer', interest: 0.6 },
            
            // Window title bars (when visible)
            ...Array.from(document.querySelectorAll('.window-header')).map(header => {
                const rect = header.getBoundingClientRect();
                return {
                    x: rect.right + 20,
                    y: rect.top + rect.height / 2,
                    type: 'window',
                    interest: 0.7,
                    element: header
                };
            })
        ];
    }

    startBehaviorLoop() {
        setInterval(() => {
            this.updateBehavior();
            this.updatePosition();
        }, 100);

        // State evaluation less frequently
        setInterval(() => {
            this.evaluateState();
        }, 2000);
    }

    evaluateState() {
        const timeSinceActivity = Date.now() - this.lastUserActivity;
        const timeSinceStateChange = Date.now() - this.lastStateChange;
        const distanceToMouse = this.getDistanceToMouse();

        // State transition logic
        if (timeSinceActivity < 1000 && distanceToMouse < 200) {
            this.setState('hiding'); // Hide when user is close and active
        } else if (timeSinceActivity > 10000) {
            this.setState('curious'); // Get curious when user is idle
        } else if (timeSinceActivity > 3000 && Math.random() < this.personality.curiosity) {
            this.setState('inspecting'); // Occasionally inspect things
        } else if (timeSinceActivity > 1000 && timeSinceActivity < 5000) {
            this.setState('following'); // Follow at distance when user is moderately active
        } else {
            this.setState('idle');
        }
    }

    setState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.lastStateChange = Date.now();
            this.onStateChange();
        }
    }

    onStateChange() {
        switch (this.state) {
            case 'hiding':
                this.element.style.opacity = '0.2';
                this.element.style.transform = 'scale(0.7)';
                this.findHidingSpot();
                break;
            case 'curious':
                this.element.style.opacity = '0.8';
                this.element.style.transform = 'scale(1.1)';
                this.findInterestingSpot();
                break;
            case 'following':
                this.element.style.opacity = '0.6';
                this.element.style.transform = 'scale(1)';
                this.followAtDistance();
                break;
            case 'inspecting':
                this.element.style.opacity = '0.9';
                this.element.style.transform = 'scale(1.05)';
                this.inspectRandomElement();
                break;
            default: // idle
                this.element.style.opacity = '0.6';
                this.element.style.transform = 'scale(1)';
                this.patrolArea();
                break;
        }
    }

    updateBehavior() {
        // Add subtle randomness to movement
        if (Math.random() < 0.1) {
            this.targetPosition.x += (Math.random() - 0.5) * 20;
            this.targetPosition.y += (Math.random() - 0.5) * 20;
        }

        // Ensure target stays within bounds
        this.constrainTarget();
    }

    updatePosition() {
        // Smooth movement with physics-like behavior
        const dx = this.targetPosition.x - this.position.x;
        const dy = this.targetPosition.y - this.position.y;
        
        this.velocity.x += dx * 0.01;
        this.velocity.y += dy * 0.01;
        
        // Apply friction
        this.velocity.x *= 0.85;
        this.velocity.y *= 0.85;
        
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Apply to element
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
    }

    findHidingSpot() {
        const hideSpots = [
            { x: 30, y: 100 },
            { x: window.innerWidth - 50, y: 100 },
            { x: 30, y: window.innerHeight - 150 },
            { x: window.innerWidth - 50, y: window.innerHeight - 150 }
        ];
        
        // Choose spot furthest from mouse
        let bestSpot = hideSpots[0];
        let maxDistance = 0;
        
        hideSpots.forEach(spot => {
            const distance = Math.sqrt(
                Math.pow(spot.x - this.mousePosition.x, 2) + 
                Math.pow(spot.y - this.mousePosition.y, 2)
            );
            if (distance > maxDistance) {
                maxDistance = distance;
                bestSpot = spot;
            }
        });
        
        this.targetPosition = { ...bestSpot };
    }

    followAtDistance() {
        const safeDistance = 150;
        const distanceToMouse = this.getDistanceToMouse();
        
        if (distanceToMouse > safeDistance * 2) {
            // Move closer, but not too close
            const angle = Math.atan2(
                this.mousePosition.y - this.position.y,
                this.mousePosition.x - this.position.x
            );
            
            this.targetPosition.x = this.mousePosition.x - Math.cos(angle) * safeDistance;
            this.targetPosition.y = this.mousePosition.y - Math.sin(angle) * safeDistance;
        }
    }

    findInterestingSpot() {
        if (this.interestPoints.length === 0) return;
        
        // Choose a random interesting point, weighted by interest level
        const weightedPoints = this.interestPoints.filter(point => 
            Math.random() < point.interest
        );
        
        if (weightedPoints.length > 0) {
            const target = weightedPoints[Math.floor(Math.random() * weightedPoints.length)];
            this.targetPosition = { x: target.x, y: target.y };
        }
    }

    inspectRandomElement() {
        const elements = document.querySelectorAll('.window, .project-card, .skill-tag');
        if (elements.length === 0) return;
        
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        const rect = randomElement.getBoundingClientRect();
        
        // Position near the element
        this.targetPosition.x = rect.right + 30;
        this.targetPosition.y = rect.top + rect.height / 2;
        
        // Add subtle glow effect to show interest
        setTimeout(() => {
            randomElement.style.boxShadow = '0 0 15px rgba(255, 0, 64, 0.3)';
            setTimeout(() => {
                randomElement.style.boxShadow = '';
            }, 1500);
        }, 500);
    }

    patrolArea() {
        // Gentle patrol movement
        const patrolPoints = [
            { x: window.innerWidth * 0.8, y: 120 },
            { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 },
            { x: window.innerWidth * 0.9, y: window.innerHeight * 0.6 },
            { x: window.innerWidth * 0.8, y: window.innerHeight - 150 }
        ];
        
        if (!this.currentPatrolTarget || this.getDistanceToTarget() < 50) {
            this.currentPatrolTarget = patrolPoints[Math.floor(Math.random() * patrolPoints.length)];
            this.targetPosition = { ...this.currentPatrolTarget };
        }
    }

    reactToClick(x, y) {
        // Show brief interest in clicks
        const distance = Math.sqrt(
            Math.pow(x - this.position.x, 2) + 
            Math.pow(y - this.position.y, 2)
        );
        
        if (distance < 300) {
            this.element.style.transform = 'scale(1.2)';
            this.element.style.filter = 'hue-rotate(45deg)';
            
            setTimeout(() => {
                this.element.style.transform = 'scale(1)';
                this.element.style.filter = '';
            }, 300);
        }
    }

    reactToScroll() {
        // Briefly become more visible during scrolling
        this.element.style.opacity = '0.8';
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.element.style.opacity = '0.6';
        }, 1000);
    }

    reactToElementHover(element) {
        // Show subtle interest when user hovers important elements
        this.element.style.transform = 'scale(1.05)';
        this.element.style.opacity = '0.8';
        
        setTimeout(() => {
            this.element.style.transform = 'scale(1)';
            this.element.style.opacity = '0.6';
        }, 500);
    }

    getDistanceToMouse() {
        return Math.sqrt(
            Math.pow(this.mousePosition.x - this.position.x, 2) + 
            Math.pow(this.mousePosition.y - this.position.y, 2)
        );
    }

    getDistanceToTarget() {
        return Math.sqrt(
            Math.pow(this.targetPosition.x - this.position.x, 2) + 
            Math.pow(this.targetPosition.y - this.position.y, 2)
        );
    }

    constrainTarget() {
        const margin = 50;
        this.targetPosition.x = Math.max(margin, Math.min(window.innerWidth - margin, this.targetPosition.x));
        this.targetPosition.y = Math.max(70, Math.min(window.innerHeight - 90, this.targetPosition.y));
    }

    // Public methods for other modules to interact with Null
    getState() {
        return this.state;
    }

    forceState(newState) {
        this.setState(newState);
    }

    addInterestPoint(point) {
        this.interestPoints.push(point);
    }

    removeInterestPoint(index) {
        this.interestPoints.splice(index, 1);
    }

    updatePersonality(traits) {
        this.personality = { ...this.personality, ...traits };
    }
}

// Global variable for other modules to access
let nullEntity;