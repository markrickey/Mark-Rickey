document.addEventListener('DOMContentLoaded', () => {
    
    // --- Scroll Progress Bar Logic ---
    const progressBar = document.getElementById('progressBar');
    
    const updateProgressBar = () => {
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollTotal) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    };
    
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Initialize on load

    // --- Fade-in on Scroll Logic using Intersection Observer ---
    const faders = document.querySelectorAll('.fade-in-on-scroll');
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from bottom of viewport
        threshold: 0.1 // 10% of the item must be visible
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('.nav-link, .hero-cta');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 20; // Small offset for better visual positioning
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Active Navigation Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navigationLinks = document.querySelectorAll('.nav-link');

    const highlightNavigation = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + 200; // Offset for better UX
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navigationLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initialize on load

    // --- Contact Form Handling ---
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const organization = formData.get('organization');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // --- Email Validation Helper ---
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- Notification System ---
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            line-height: 1.5;
        `;
        
        // Set colors based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#d4edda';
            notification.style.color = '#155724';
            notification.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.border = '1px solid #f5c6cb';
        } else {
            notification.style.backgroundColor = '#d1ecf1';
            notification.style.color = '#0c5460';
            notification.style.border = '1px solid #bee5eb';
        }
        
        // Style the content
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        `;
        
        // Style the close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.opacity = '1';
        });
        
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.opacity = '0.7';
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        // Close button functionality
        closeButton.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // --- Enhanced Hover Effects for Project Cards ---
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // --- Enhanced Hover Effects for Article Cards ---
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // --- Skill Tag Interactive Effects ---
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.05)';
            tag.style.boxShadow = '0 2px 8px rgba(36, 83, 101, 0.2)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1)';
            tag.style.boxShadow = 'none';
        });
    });

    // --- Lazy Loading for Images ---
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.transition = 'opacity 0.3s ease-in-out';
                img.style.opacity = '0';
                
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.style.opacity = '1';
                };
                tempImg.src = img.src;
                
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // --- Keyboard Navigation Enhancement ---
    document.addEventListener('keydown', (e) => {
        // Enable keyboard navigation for the sidebar
        if (e.key === 'Tab') {
            const focusableElements = document.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // --- Performance Optimization: Throttled Scroll Events ---
    let ticking = false;
    
    function throttledScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgressBar();
                highlightNavigation();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Replace the individual scroll listeners with throttled version
    window.removeEventListener('scroll', updateProgressBar);
    window.removeEventListener('scroll', highlightNavigation);
    window.addEventListener('scroll', throttledScrollHandler);

    // --- Initialize animations and effects ---
    console.log('Mark R. Portfolio - Interactive features initialized');
    
    // Add active state styles for navigation
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: #DB7A4D !important;
            font-weight: 600;
        }
        
        .nav-link {
            transition: all 0.3s ease;
        }
        
        .skill-tag {
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .project-card, .article-card {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
function loadPosts() {
  fetch("https://script.google.com/macros/s/AKfycbzeHzVAswHUPbO0AjGNvSnIxVuaaiyECQUPUmrfV1IuLE5n5wfmD4-vLyoVJxhPltMw/exec")
    .then(r=>r.json())
    .then(posts=>{
      let html = '';
      posts.reverse().forEach(post=>{
        html += `<div class="blogpost">
          <p>${post.post}</p>
          <small>${post.timestamp} by ${post.author}</small>
          <br>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.url)}" target="_blank">Share on LinkedIn</a>
        </div>`;
      });
      document.getElementById('blogFeed').innerHTML = html;
    });
}
// On page load:
loadPosts();
document.getElementById('revealAdminBtn').onclick = function() {
  if (prompt("Admin access: what is the code?") === "Manila92!") {
    document.getElementById('adminPostForm').style.display = 'block';
    this.style.display = 'none';
  }
};
function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  if (params.type === "contact") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ContactMessages");
    var row = [
      new Date(), params.name, params.email, params.organization || "", params.subject || "", params.message
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({success:true, type:"contact"}));
  }
  // ... handle other types (like 'blog') ...
}

