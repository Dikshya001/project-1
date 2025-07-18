document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // Hamburger Menu Toggle
    // ------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active'); // For animating the hamburger icon
        });

        // Close nav when a link is clicked (for single-page feel on mobile)
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }

    // ------------------------------------
    // Smooth Scrolling for Anchors (if needed, e.g., for service page jump links)
    // ------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Adjust scroll position to account for sticky header
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Added extra 20px padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ------------------------------------
    // Testimonial Slider (Homepage)
    // ------------------------------------
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const prevArrow = document.querySelector('.slider-arrow.prev-arrow');
    const nextArrow = document.querySelector('.slider-arrow.next-arrow');
    const sliderNavDotsContainer = document.querySelector('.slider-nav-dots');
    let testimonialIndex = 0;
    let autoSlideInterval;

    function createDots() {
        if (!testimonialSlider || !sliderNavDotsContainer) return;
        sliderNavDotsContainer.innerHTML = ''; // Clear existing dots
        const totalSlides = testimonialSlider.children.length;
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.addEventListener('click', () => showTestimonial(i));
            sliderNavDotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!sliderNavDotsContainer) return;
        document.querySelectorAll('.slider-nav-dots .dot').forEach((dot, idx) => {
            if (idx === testimonialIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function showTestimonial(index) {
        if (!testimonialSlider) return;
        const totalSlides = testimonialSlider.children.length;
        if (index >= totalSlides) {
            testimonialIndex = 0;
        } else if (index < 0) {
            testimonialIndex = totalSlides - 1;
        } else {
            testimonialIndex = index;
        }

        const offset = -testimonialIndex * 100; // Assuming each slide takes 100% width
        testimonialSlider.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval); // Clear existing interval
        autoSlideInterval = setInterval(() => {
            showTestimonial(testimonialIndex + 1);
        }, 6000); // Change slide every 6 seconds
    }

    if (testimonialSlider) {
        createDots();
        showTestimonial(testimonialIndex); // Show initial testimonial and activate dot
        startAutoSlide(); // Start auto-sliding

        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                showTestimonial(testimonialIndex - 1);
                startAutoSlide(); // Reset auto-slide on manual navigation
            });
        }
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                showTestimonial(testimonialIndex + 1);
                startAutoSlide(); // Reset auto-slide on manual navigation
            });
        }
    }


    // ------------------------------------
    // Portfolio Filtering (Our Works Page)
    // ------------------------------------
    const filterButtons = document.querySelectorAll('.portfolio-filters .filter-btn');
    const portfolioGrid = document.querySelector('.portfolio-grid .container'); // Select the grid container
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Remove active class from all buttons and add to clicked one
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter items with a transition
                portfolioItems.forEach(item => {
                    item.style.transition = 'all 0.5s ease-in-out'; // Add transition
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.style.display = 'block'; // Make sure it's block for proper layout
                        item.style.width = '100%'; // Revert width if flex/grid changes it
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        // Use a timeout to hide after animation, or handle with grid properties
                        setTimeout(() => {
                             item.style.display = 'none';
                        }, 500); // Match CSS transition duration
                    }
                });
            });
        });
    }


    // ------------------------------------
    // Contact Form Submission (Basic example - requires backend for actual email sending)
    // ------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#007bff'; // Primary color

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Simple client-side validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                formStatus.textContent = 'Please fill in all required fields.';
                formStatus.style.color = 'red';
                return;
            }
            if (!/\S+@\S+\.\S+/.test(data.email)) {
                formStatus.textContent = 'Please enter a valid email address.';
                formStatus.style.color = 'red';
                return;
            }


            // In a real application, you'd send this 'data' to a server-side script
            // (e.g., Node.js, PHP, Python) that handles email sending.
            // For now, we'll simulate a successful submission.

            try {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 2500)); // Longer simulation

                console.log('Form Data:', data);
                formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                formStatus.style.color = 'var(--accent-color)'; // Accent color for success
                contactForm.reset(); // Clear the form

            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = 'Failed to send message. Please try again later.';
                formStatus.style.color = 'red';
            }
        });
    }

    // ------------------------------------
    // Image Lazy Loading (for performance) - keep this for optimization
    // ------------------------------------
    const lazyLoadImages = document.querySelectorAll('img[loading="lazy"]'); // Add loading="lazy" to your img tags
    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    // Ensure the image has a data-src attribute for lazy loading
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    lazyImage.removeAttribute('loading'); // Remove lazy loading attribute
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        }, {
            rootMargin: '0px 0px 100px 0px' // Load images when they are 100px below viewport
        });

        lazyLoadImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        lazyLoadImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }


    // ------------------------------------
    // Section Fade-in on Scroll (Unique Design Touch)
    // ------------------------------------
    const sections = document.querySelectorAll('section:not(.hero-section)'); // Exclude hero section
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add a class to trigger CSS animation
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in-section'); // Add initial class for animation target
        sectionObserver.observe(section);
    });

    // Add this to your style.css for the fade-in effect:
    /*
    .fade-in-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }

    .fade-in-section.visible {
        opacity: 1;
        transform: translateY(0);
    }
    */
});