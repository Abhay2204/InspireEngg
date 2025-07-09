// ===== MAIN APPLICATION CLASS ===== //
class IESWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initAnimations();
        this.initNavigation();
        this.initCounters();
        this.initScrollEffects();
        this.initBackToTop();
        this.initPerformanceOptimizations();
    }

    // ===== EVENT BINDINGS ===== //
    bindEvents() {
        window.addEventListener('load', () => this.onPageLoad());
        window.addEventListener('scroll', this.throttle(() => this.onScroll(), 16), { passive: true });
        window.addEventListener('resize', this.debounce(() => this.onResize(), 250), { passive: true });
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    }

    onPageLoad() {
        document.body.classList.add('loaded');
        this.initAOS();
        this.preloadImages();
    }

    onDOMReady() {
        this.initLazyLoading();
        this.initIntersectionObservers();
    }

    onScroll() {
        this.handleNavbarScroll();
        this.handleBackToTop();
        this.handleParallaxEffects();
    }

    onResize() {
        this.handleResponsiveElements();
    }

    // ===== NAVIGATION ===== //
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                    this.closeMobileMenu();
                }
            });
        });

        this.initActiveNavigation();
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

    closeMobileMenu() {
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    }

    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => link.classList.remove('active'));
                    
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

    // ===== COUNTER ANIMATIONS ===== //
    initCounters() {
        const counterElements = document.querySelectorAll('.stat-number');
        
        if (counterElements.length > 0) {
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

            // Observe both hero and stats sections
            const heroSection = document.querySelector('.hero-section');
            const statsSection = document.querySelector('.stats-section');
            
            if (heroSection) observer.observe(heroSection);
            if (statsSection) observer.observe(statsSection);
        }
    }

    animateCounters(elements) {
        elements.forEach((element, index) => {
            const target = parseInt(element.getAttribute('data-target')) || 0;
            const duration = 2000;
            const delay = index * 200;

            setTimeout(() => {
                this.animateValue(element, 0, target, duration);
            }, delay);
        });
    }

    animateValue(element, start, end, duration) {
        let startTime = null;
        const suffix = end === 0 ? '' : (end === 100 ? '%' : '+');

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(easeOutCubic * (end - start) + start);
            
            element.textContent = value + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }

    // ===== ANIMATIONS ===== //
    initAnimations() {
        this.initHeroAnimations();
        this.initFloatingCards();
        this.initButtonEffects();
        this.initScrollAnimations();
    }

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic',
                disable: window.innerWidth < 768 ? 'mobile' : false
            });
        }
    }

    initHeroAnimations() {
        const heroElements = [
            '.hero-badge',
            '.hero-title',
            '.hero-description',
            '.hero-stats',
            '.hero-actions'
        ];

        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200 + 500);
            }
        });
    }

    initFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            }, 1500 + (index * 300));

            this.addCardHoverEffects(card);
        });
    }

    addCardHoverEffects(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) translateY(-5px)';
            card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateY(0)';
            card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
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
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ===== SCROLL EFFECTS ===== //
    initScrollEffects() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.smoothScrollTo('#about');
            });
        }
    }

    handleParallaxEffects() {
        const scrolled = window.pageYOffset;
        
        // Geometric shapes parallax
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });

        // Floating cards parallax
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = 0.05 + (index * 0.02);
            const yPos = -(scrolled * speed);
            card.style.transform = `translateY(${yPos}px)`;
        });

        // Scroll indicator fade
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - scrolled / 300);
            scrollIndicator.style.opacity = opacity;
        }
    }

    // ===== BACK TO TOP ===== //
    initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    handleBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        const scrolled = window.pageYOffset;
        
        if (backToTopBtn) {
            if (scrolled > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    // ===== PERFORMANCE OPTIMIZATIONS ===== //
    initPerformanceOptimizations() {
        this.initLazyLoading();
        this.preloadCriticalResources();
    }

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    preloadImages() {
        const criticalImages = [
            'logo.png',
            'group.jpg'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap'
        ];

        criticalResources.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    initIntersectionObservers() {
        // Optimize animations based on viewport
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                } else {
                    entry.target.classList.remove('in-viewport');
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ===== RESPONSIVE HANDLING ===== //
    handleResponsiveElements() {
        const floatingCards = document.querySelectorAll('.floating-card');
        const isMobile = window.innerWidth <= 768;
        
        floatingCards.forEach(card => {
            if (isMobile) {
                card.style.display = 'none';
            } else {
                card.style.display = 'flex';
            }
        });

        // Reinitialize AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // ===== UTILITY FUNCTIONS ===== //
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // ===== ERROR HANDLING ===== //
    handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        // You can add error reporting here
    }
}

// ===== ADDITIONAL STYLES INJECTION ===== //
const additionalStyles = `
<style>
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy.loaded {
    opacity: 1;
}

.in-viewport {
    /* Add any viewport-specific styles here */
}

/* Performance optimizations */
.shape,
.floating-card,
.main-hero-image {
    backface-visibility: hidden;
    perspective: 1000px;
    transform-style: preserve-3d;
}

/* Smooth scrolling for all browsers */
html {
    scroll-behavior: smooth;
}

/* Focus styles for accessibility */
.btn-primary-custom:focus,
.btn-outline-custom:focus,
.nav-link:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Loading states */
.loading {
    opacity: 0.7;
    pointer-events: none;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    :root {
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    }
}

/* Print styles */
@media print {
    .navbar-custom,
    .back-to-top,
    .floating-card {
        display: none !important;
    }
    
    .hero-section {
        min-height: auto;
        padding: 2rem 0;
    }
}
</style>
`;

// ===== INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inject additional styles
        document.head.insertAdjacentHTML('beforeend', additionalStyles);
        
        // Initialize the website
        const website = new IESWebsite();
        
        // Make it globally available for debugging
        window.iesWebsite = website;
        
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
                    }
                }, 0);
            });
        }
        
    } catch (error) {
        console.error('Failed to initialize website:', error);
    }
});

// ===== SERVICE WORKER REGISTRATION (Optional) ===== //
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}