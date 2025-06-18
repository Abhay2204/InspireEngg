// ===== MAIN APPLICATION ===== //
class IESWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initAnimations();
        this.initParallax();
        this.initCounters();
        this.initNavigation();
        this.initScrollEffects();
    }

    // ===== EVENT BINDINGS ===== //
    bindEvents() {
        window.addEventListener('load', () => this.onPageLoad());
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('resize', () => this.onResize(), { passive: true });
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    }

    onPageLoad() {
        // Remove loading states, trigger enter animations
        document.body.classList.add('loaded');
        this.triggerEnterAnimations();
    }

    onDOMReady() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        }
    }

    onScroll() {
        this.handleNavbarScroll();
        this.handleParallax();
        this.handleScrollProgress();
    }

    onResize() {
        this.handleResponsiveElements();
    }

    // ===== NAVIGATION ===== //
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(navbarCollapse).hide();
                    }
                }
            });
        });

        // Active section highlighting
        this.initSectionObserver();
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    initSectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -70% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // ===== NAVBAR SCROLL EFFECTS ===== //
    handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ===== PARALLAX EFFECTS ===== //
    initParallax() {
        this.parallaxElements = document.querySelectorAll('.hero-bg-layer');
        this.particles = document.querySelectorAll('.particle');
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Background layers parallax
        this.parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // Particles parallax
        this.particles.forEach((particle, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = -(scrolled * speed);
            const rotation = scrolled * 0.1;
            particle.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
        });

        // Floating cards parallax
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            card.style.transform = `translateY(${yPos}px)`;
        });
    }

    // ===== COUNTER ANIMATIONS ===== //
    initCounters() {
        const counterElements = document.querySelectorAll('.stat-number');
        const heroSection = document.querySelector('.hero-section');

        if (heroSection && counterElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounters(counterElements);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });

            observer.observe(heroSection);
        }
    }

    animateCounters(elements) {
        elements.forEach((element, index) => {
            const target = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
            const duration = 2000;
            const delay = index * 200;

            setTimeout(() => {
                this.animateValue(element, 0, target, duration);
            }, delay);
        });
    }

    animateValue(element, start, end, duration) {
        let startTime = null;
        const suffix = end === 0 ? '' : '+';

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(easeOutCubic * (end - start) + start);
            
            element.textContent = value + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }

    // ===== SCROLL PROGRESS ===== //
    handleScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // You can use this for a progress bar if needed
        // document.getElementById('progressBar').style.width = scrolled + '%';
    }

    // ===== ANIMATIONS ===== //
    initAnimations() {
        // Hero entrance animation
        this.initHeroAnimations();
        
        // Floating cards animation
        this.initFloatingCards();
        
        // Button hover effects
        this.initButtonEffects();
    }

    initHeroAnimations() {
        const heroElements = {
            badge: document.querySelector('.hero-badge'),
            title: document.querySelector('.hero-title'),
            description: document.querySelector('.hero-description'),
            stats: document.querySelector('.hero-stats'),
            actions: document.querySelector('.hero-actions'),
            visual: document.querySelector('.hero-visual')
        };

        // Stagger entrance animations
        Object.values(heroElements).forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }

    initFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        
        cards.forEach((card, index) => {
            // Initial state
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) translateY(20px)';
            
            // Animate in with delay
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            }, 1000 + (index * 300));

            // Hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05) translateY(-5px)';
                card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1) translateY(0)';
                card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            });
        });
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll('.btn-primary-custom, .btn-outline-custom');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createRipple(e, button);
            });
        });
    }

    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // ===== SCROLL EFFECTS ===== //
    initScrollEffects() {
        // Hide/show scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const opacity = Math.max(0, 1 - scrolled / 300);
                scrollIndicator.style.opacity = opacity;
            }, { passive: true });
        }

        // Scroll indicator click
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const nextSection = document.querySelector('#about') || document.querySelector('section:nth-of-type(2)');
                if (nextSection) {
                    this.smoothScrollTo('#' + nextSection.id);
                }
            });
        }
    }

    // ===== RESPONSIVE HANDLING ===== //
    handleResponsiveElements() {
        const heroVisual = document.querySelector('.hero-visual');
        const floatingCards = document.querySelectorAll('.floating-card');
        
        // Handle floating cards on mobile
        if (window.innerWidth <= 575) {
            floatingCards.forEach(card => {
                card.style.display = 'none';
            });
        } else {
            floatingCards.forEach(card => {
                card.style.display = 'flex';
            });
        }
    }

    // ===== UTILITY FUNCTIONS ===== //
    triggerEnterAnimations() {
        // Trigger any entrance animations after page load
        const animatedElements = document.querySelectorAll('[data-animate="fade-in"]');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 100);
        });
    }

    // ===== IMAGE OPTIMIZATION ===== //
    initImageOptimization() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                img.classList.add('error');
                // Optionally set a fallback image
                // img.src = 'path/to/fallback-image.jpg';
            });
        });
    }
}

// ===== CSS ANIMATIONS (INJECT INTO HEAD) ===== //
const additionalStyles = `
<style>
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.loaded {
    opacity: 1;
}

.hero-main-image.loaded {
    animation: imageReveal 1s ease-out;
}

@keyframes imageReveal {
    from {
        opacity: 0;
        transform: scale(1.1);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Performance optimizations */
.hero-bg-layer,
.particle,
.floating-card {
    backface-visibility: hidden;
    perspective: 1000px;
}
</style>
`;

// ===== INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', () => {
    // Inject additional styles
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
    
    // Initialize the website
    const website = new IESWebsite();
    
    // Make it globally available for debugging
    window.iesWebsite = website;
});

// ===== PERFORMANCE MONITORING ===== //
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
        }, 0);
    });
}