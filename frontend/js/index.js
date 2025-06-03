/**
 * Portfolio Main JavaScript
 * Inicialización y funcionalidades generales
 */

// Initialize enhanced system
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    // Initialize Null Entity
    nullEntity = new NullEntity();
    
    // Setup core functionalities
    setupSmoothScrolling();
    setupInteractions();
    setupLoadingAnimations();
    setupResponsiveHandlers();
    
    // Start system heartbeat
    startSystemHeartbeat();
    
    console.log('🤖 Portfolio initialized - Null Entity active');
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Notify Null about navigation
                if (nullEntity) {
                    nullEntity.lastUserActivity = Date.now();
                    nullEntity.reactToElementHover(target);
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav item
                updateActiveNavItem(this.getAttribute('href'));
            }
        });
    });
}

// Update active navigation item
function updateActiveNavItem(targetId) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelectorAll('.dock-item').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeNavLink = document.querySelector(`.nav-menu a[href="${targetId}"]`);
    const activeDockLink = document.querySelector(`.dock-item[href="${targetId}"]`);
    
    if (activeNavLink) activeNavLink.classList.add('active');
    if (activeDockLink) activeDockLink.classList.add('active');
}

// Enhanced interactions
function setupInteractions() {
    // Glitch effects on hover
    document.querySelectorAll('.glitch').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.textShadow = '2px 2px 4px var(--accent-red)';
            
            // Null reaction to glitch elements
            if (nullEntity && Math.random() < 0.3) {
                nullEntity.reactToElementHover(element);
            }
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.textShadow = '2px 2px 4px var(--shadow-purple)';
        });
    });

    // Window interaction effects
    document.querySelectorAll('.window').forEach(window => {
        window.addEventListener('mouseenter', () => {
            window.style.borderColor = '#ff6b6b';
            
            // Add window to Null's interest points temporarily
            if (nullEntity) {
                const rect = window.getBoundingClientRect();
                nullEntity.addInterestPoint({
                    x: rect.right + 20,
                    y: rect.top + rect.height / 2,
                    type: 'temporary',
                    interest: 0.6
                });
            }
        });
        
        window.addEventListener('mouseleave', () => {
            window.style.borderColor = 'var(--accent-red)';
        });
    });

    // Enhanced button interactions
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
            
            // Null shows interest in buttons
            if (nullEntity) {
                nullEntity.element.style.filter = 'hue-rotate(90deg)';
                setTimeout(() => {
                    nullEntity.element.style.filter = '';
                }, 200);
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('click', () => {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Loading animations for sections
function setupLoadingAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Null reacts to new sections becoming visible
                if (nullEntity) {
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        nullEntity.lastUserActivity = Date.now();
                        
                        // Adjust Null's personality based on section
                        switch(sectionId) {
                            case 'skills':
                                nullEntity.updatePersonality({ curiosity: 0.9 });
                                break;
                            case 'projects':
                                nullEntity.updatePersonality({ playfulness: 0.8 });
                                break;
                            case 'contact':
                                nullEntity.updatePersonality({ shyness: 0.5 });
                                break;
                        }
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe all main sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Responsive handlers
function setupResponsiveHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (nullEntity) {
                nullEntity.constrainTarget();
                nullEntity.identifyInterestPoints();
            }
            
            // Adjust layout for mobile
            handleMobileLayout();
        }, 250);
    });
    
    // Initial mobile check
    handleMobileLayout();
}

// Handle mobile-specific layout adjustments
function handleMobileLayout() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Hide navigation menu on mobile
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.style.display = 'none';
        }
        
        // Adjust Null's behavior for mobile
        if (nullEntity) {
            nullEntity.updatePersonality({
                shyness: 0.7, // More shy on mobile
                curiosity: 0.4 // Less curious to avoid interference
            });
        }
    } else {
        // Show navigation menu on desktop
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.style.display = 'flex';
        }
        
        // Reset Null's personality for desktop
        if (nullEntity) {
            nullEntity.updatePersonality({
                shyness: 0.3,
                curiosity: 0.7
            });
        }
    }
}

// System heartbeat for status indicator
function startSystemHeartbeat() {
    setInterval(() => {
        const indicator = document.querySelector('.status-indicator');
        if (indicator) {
            indicator.style.transform = 'scale(1.2)';
            setTimeout(() => {
                indicator.style.transform = 'scale(1)';
            }, 100);
        }
        
        // Occasionally make Null pulse with the heartbeat
        if (nullEntity && Math.random() < 0.2) {
            nullEntity.element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                nullEntity.element.style.transform = 'scale(1)';
            }, 100);
        }
    }, 3000);
}

// Utility functions for other modules
window.PortfolioUtils = {
    // Get current active section
    getCurrentSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                return section.id;
            }
        }
        return 'home';
    },
    
    // Notify Null about user interaction
    notifyNull(interactionType, data = {}) {
        if (nullEntity) {
            nullEntity.lastUserActivity = Date.now();
            
            switch(interactionType) {
                case 'skill-hover':
                    nullEntity.forceState('inspecting');
                    break;
                case 'project-click':
                    nullEntity.forceState('curious');
                    break;
                case 'contact-focus':
                    nullEntity.forceState('following');
                    break;
            }
        }
    },
    
    // Get Null's current state
    getNullState() {
        return nullEntity ? nullEntity.getState() : 'inactive';
    }
};

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 16) { // Flag slow operations
                console.warn(`⚠️ Slow operation: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
            }
        }
    });
    observer.observe({ entryTypes: ['measure'] });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('💥 Portfolio error:', e.error);
    
    // Null reacts to errors
    if (nullEntity) {
        nullEntity.element.style.filter = 'hue-rotate(180deg) contrast(2)';
        setTimeout(() => {
            nullEntity.element.style.filter = '';
        }, 500);
    }
});

console.log('📱 Portfolio Core loaded - Ready for initialization');