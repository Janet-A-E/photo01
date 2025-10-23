// Janet Wedding Photography - Main JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const galleryGrid = document.getElementById('galleryGrid');

// State Management
let currentSlide = 0;
let currentLightboxIndex = 0;
let galleryImages = [];
let filteredImages = [];
let isLightboxOpen = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize components
    initializeSlider();
    initializeGallery();
    initializeScrollAnimations();
    
    // Start auto-slider
    startAutoSlider();
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Contact form
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Gallery filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => filterGallery(btn.dataset.filter));
    });
    
    // Gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    // Back to top button
    backToTop.addEventListener('click', scrollToTop);
    
    // Lightbox events
    document.addEventListener('keydown', handleKeyDown);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
}

// Navigation Functions
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    // Scroll animations
    animateOnScroll();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Hero Slider Functions
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Store slide count
    window.slideCount = slides.length;
    
    // Show first slide
    showSlide(0);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    currentSlide = index;
}

function changeSlide(direction) {
    const slideCount = window.slideCount || 3;
    currentSlide += direction;
    
    if (currentSlide >= slideCount) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slideCount - 1;
    }
    
    showSlide(currentSlide);
}

function currentSlideJump(index) {
    showSlide(index - 1);
}

// Make currentSlide function available globally
window.currentSlide = currentSlideJump;

function startAutoSlider() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Gallery Functions
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryImages = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt,
            category: item.dataset.category
        };
    });
    filteredImages = [...galleryImages];
}

function filterGallery(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
    
    // Filter images
    if (category === 'all') {
        filteredImages = [...galleryImages];
        galleryItems.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('hidden');
        });
    } else {
        filteredImages = galleryImages.filter(img => img.category === category);
        galleryItems.forEach(item => {
            if (item.dataset.category === category) {
                item.style.display = 'block';
                item.classList.remove('hidden');
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
    }
    
    // Add animation effect
    galleryItems.forEach((item, index) => {
        if (!item.classList.contains('hidden')) {
            setTimeout(() => {
                item.style.animation = 'fadeIn 0.5s ease forwards';
            }, index * 100);
        }
    });
}

// Lightbox Functions
function openLightbox(index) {
    const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
    const clickedItem = visibleItems[index];
    
    if (clickedItem) {
        const img = clickedItem.querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        
        // Find the index in filtered images
        const imgSrc = img.src;
        currentLightboxIndex = filteredImages.findIndex(img => img.src === imgSrc);
        
        lightbox.classList.add('active');
        isLightboxOpen = true;
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    isLightboxOpen = false;
    document.body.style.overflow = '';
}

function lightboxNext() {
    if (filteredImages.length > 0) {
        currentLightboxIndex = (currentLightboxIndex + 1) % filteredImages.length;
        const nextImage = filteredImages[currentLightboxIndex];
        lightboxImage.src = nextImage.src;
        lightboxImage.alt = nextImage.alt;
    }
}

function lightboxPrev() {
    if (filteredImages.length > 0) {
        currentLightboxIndex = (currentLightboxIndex - 1 + filteredImages.length) % filteredImages.length;
        const prevImage = filteredImages[currentLightboxIndex];
        lightboxImage.src = prevImage.src;
        lightboxImage.alt = prevImage.alt;
    }
}

function handleKeyDown(e) {
    if (isLightboxOpen) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                lightboxPrev();
                break;
            case 'ArrowRight':
                lightboxNext();
                break;
        }
    }
}

// Contact Form Functions
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    submitContactForm(data)
        .then(response => {
            if (response.success) {
                showSuccessMessage('Thank you for your inquiry! I will get back to you within 24-48 hours.');
                contactForm.reset();
                clearFormErrors();
            } else {
                showErrorMessage('There was an error sending your message. Please try again or contact me directly.');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showErrorMessage('There was an error sending your message. Please try again or contact me directly.');
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

function validateForm(data) {
    let isValid = true;
    clearFormErrors();
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}

function clearFormErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
    
    // Clear any existing success/error messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => {
        if (msg.parentElement === contactForm) {
            msg.remove();
        }
    });
}

function showSuccessMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.textContent = message;
    contactForm.insertBefore(messageElement, contactForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'error-message';
    messageElement.textContent = message;
    messageElement.style.background = '#f8d7da';
    messageElement.style.color = '#721c24';
    messageElement.style.padding = '1rem';
    messageElement.style.borderRadius = '8px';
    messageElement.style.marginBottom = '1rem';
    messageElement.style.border = '1px solid #f5c6cb';
    
    contactForm.insertBefore(messageElement, contactForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Simulate API call (replace with actual backend endpoint)
async function submitContactForm(data) {
    // This is a simulation - replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate successful submission
            resolve({ success: true });
            
            // For actual implementation, use:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(data => resolve(data))
            // .catch(error => reject(error));
        }, 1500);
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'animated');
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

function animateOnScroll() {
    const elements = document.querySelectorAll('.scroll-animate:not(.animated)');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animated');
        }
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimize scroll performance
const optimizedScroll = throttle(handleScroll, 16);
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', optimizedScroll);

// Add CSS animations dynamically
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.6s ease forwards;
        }
        
        .animate-slide-in {
            animation: slideIn 0.6s ease forwards;
        }
        
        .animate-scale-in {
            animation: scaleIn 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addAnimationStyles();

// Touch/Swipe Support for Mobile
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) {
        return;
    }
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    // Swipe detection for hero slider
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
            changeSlide(1); // Swipe left - next slide
        } else if (deltaX < -50) {
            changeSlide(-1); // Swipe right - previous slide
        }
    }
    
    // Swipe detection for lightbox
    if (isLightboxOpen) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 50) {
                lightboxNext(); // Swipe left - next image
            } else if (deltaX < -50) {
                lightboxPrev(); // Swipe right - previous image
            }
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: true });

// Lazy Loading for Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
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
}

// Initialize lazy loading
lazyLoadImages();

// Performance Monitoring
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
}

// Log performance after page load
window.addEventListener('load', logPerformance);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// Accessibility Improvements
function setupAccessibility() {
    // Add keyboard navigation for gallery
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add ARIA labels dynamically
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (button.innerHTML.includes('chevron-left')) {
            button.setAttribute('aria-label', 'Previous');
        } else if (button.innerHTML.includes('chevron-right')) {
            button.setAttribute('aria-label', 'Next');
        } else if (button.innerHTML.includes('x')) {
            button.setAttribute('aria-label', 'Close');
        }
    });
}

// Initialize accessibility features
setupAccessibility();

// Export functions for global access
window.scrollToSection = scrollToSection;
window.changeSlide = changeSlide;
window.currentSlide = currentSlideJump;
window.closeLightbox = closeLightbox;
window.lightboxNext = lightboxNext;
window.lightboxPrev = lightboxPrev;

console.log('Janet Wedding Photography - Website Loaded Successfully! 📸✨');