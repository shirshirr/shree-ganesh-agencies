// ===== DOM Elements =====
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// ===== Sticky Header =====
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
}

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Close mobile menu when clicking a link
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Smooth Scroll =====
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    closeMobileMenu();
}

// ===== Update Active Nav Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Back to Top =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== Form Handling =====
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (!data.name || !data.phone || !data.product || !data.message) {
        alert('Please fill in all required fields.');
        return;
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s-]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        alert('Please enter a valid phone number.');
        return;
    }

    // Email validation (if provided)
    if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address.');
            return;
        }
    }

    // Simulate form submission
    // In production, you would send this data to a server
    console.log('Form submitted:', data);

    // Show success message
    contactForm.classList.add('hidden');
    formSuccess.classList.add('show');

    // Create WhatsApp message
    const whatsappMessage = `Hello, I am interested in your products.%0A%0A` +
        `*Name:* ${data.name}%0A` +
        `*Phone:* ${data.phone}%0A` +
        `*Product:* ${data.product}%0A` +
        `*Message:* ${data.message}`;
    
    // Option to open WhatsApp
    setTimeout(() => {
        if (confirm('Would you like to send this enquiry via WhatsApp for a faster response?')) {
            window.open(`https://wa.me/919448122431?text=${whatsappMessage}`, '_blank');
        }
    }, 1500);

    // Reset form after 5 seconds
    setTimeout(() => {
        contactForm.reset();
        contactForm.classList.remove('hidden');
        formSuccess.classList.remove('show');
    }, 10000);
}

// ===== Intersection Observer for Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .testimonial-card, .about-feature, .info-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== Phone Number Click Tracking =====
function trackPhoneClick(e) {
    const phoneNumber = e.target.href || e.target.closest('a').href;
    console.log('Phone click tracked:', phoneNumber);
    // In production, you could send this to analytics
}

// ===== Initialize Event Listeners =====
function init() {
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
    
    // Back to top button
    backToTop.addEventListener('click', scrollToTop);
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', trackPhoneClick);
    });

    // Initialize scroll animations
    initScrollAnimations();

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Initial check for scroll position
    handleScroll();
}

// ===== Run on DOM Load =====
document.addEventListener('DOMContentLoaded', init);

// ===== Service Worker Registration (for PWA support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment below line if you add a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
