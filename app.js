document.addEventListener('DOMContentLoaded', () => {
    // Google Sheets API URL
    const API_URL = "https://script.google.com/macros/s/AKfycbzeHzVAswHUPbO0AjGNvSnIxVuaaiyECQUPUmrfV1IuLE5n5wfmD4-vLyoVJxhPltMw/exec";

    // --- Scroll Progress Bar Logic ---
    const progressBar = document.getElementById('progressBar');
    const updateProgressBar = () => {
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollTotal) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;
    };
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();

    // --- Fade-in on Scroll Logic using Intersection Observer ---
    const faders = document.querySelectorAll('.fade-in-on-scroll');
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });
    faders.forEach(fader => appearOnScroll.observe(fader));

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
                    const offsetTop = targetElement.offsetTop - 20;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Active Navigation Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navigationLinks = document.querySelectorAll('.nav-link');
    function highlightNavigation() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + 200;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navigationLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) link.classList.add('active');
        });
    }
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation();

    // --- Blog Loader ---
    function loadPosts() {
        fetch(API_URL)
            .then(r => r.json())
            .then(posts => {
                let html = '';
                posts.reverse().forEach(post => {
                    html += `<div class="blogpost">
                      <p>${post.post}</p>
                      <small>${post.timestamp} by ${post.author}</small>
                      <br>
                      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.url)}" target="_blank">Share on LinkedIn</a>
                    </div>`;
                });
                const blogFeed = document.getElementById('blogFeed');
                if (blogFeed) blogFeed.innerHTML = html;
            });
    }
    loadPosts();

    // --- Admin Reveal ---
    const revealAdminBtn = document.getElementById('revealAdminBtn');
    if (revealAdminBtn) {
        revealAdminBtn.onclick = function () {
            if (prompt("Admin access: what is the code?") === "Manila92!") {
                document.getElementById('adminPostForm').style.display = 'block';
                this.style.display = 'none';
            }
        };
    }

    // --- Admin Blog Post Form ---
    const blogPostForm = document.getElementById('blogPostForm');
    if (blogPostForm) {
        blogPostForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const postContent = document.getElementById('blogPost').value;
            fetch(API_URL, {
                method: "POST",
                body: JSON.stringify({
                    author: 'Mark',
                    post: postContent,
                    url: window.location.href
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("Blog post published!");
                        document.getElementById('blogPost').value = '';
                        loadPosts();
                    } else {
                        alert("There was a problem. Please try again.");
                    }
                });
        });
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            fetch(API_URL, {
                method: "POST",
                body: JSON.stringify({
                    type: "contact",
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    organization: document.getElementById("organization").value,
                    subject: document.getElementById("subject").value,
                    message: document.getElementById("message").value
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showNotification("Message received! I'll respond soon.", 'success');
                        contactForm.reset();
                    } else {
                        showNotification("There was a problem. Please try again.", 'error');
                    }
                });
        });
    }

    // --- Email Validation Helper (if you want to enforce validation before sending) ---
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- Notification System ---
    function showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
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
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex; align-items: center; justify-content: space-between; gap: 12px;
        `;
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none; border: none; font-size: 18px; cursor: pointer; color: inherit; opacity: 0.7;
            padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
        `;
        closeButton.addEventListener('click', () => removeNotification(notification));
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10);
        setTimeout(() => { removeNotification(notification); }, 5000);
    }
    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }

    // --- Hover/Interactive effects and more (as in your previous code) ---

    // --- Project Cards ---
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-8px)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
    });

    // --- Article Cards ---
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-4px)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
    });

    // --- Skill Tags ---
    document.querySelectorAll('.skill-tag').forEach(tag => {
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
                tempImg.onload = () => { img.style.opacity = '1'; };
                tempImg.src = img.src;
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => { imageObserver.observe(img); });

    // --- Keyboard Navigation for Sidebar ---
    document.addEventListener('keydown', (e) => {
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

    // --- Performance: Throttled Scroll Handling ---
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
    window.removeEventListener('scroll', updateProgressBar);
    window.removeEventListener('scroll', highlightNavigation);
    window.addEventListener('scroll', throttledScrollHandler);

    // --- Add dynamic style ---
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active { color: #DB7A4D !important; font-weight: 600; }
        .nav-link { transition: all 0.3s ease; }
        .skill-tag { transition: all 0.2s ease; cursor: pointer; }
        .project-card, .article-card { transition: all 0.3s ease;}
    `;
    document.head.appendChild(style);
});
// Interactive Timeline - Expand/Collapse Achievements & Scroll Activation
document.addEventListener('DOMContentLoaded', () => {
  // Accordion interaction
  document.querySelectorAll('.timeline-entry').forEach(entry => {
    const summary = entry.querySelector('.timeline-summary');
    const details = entry.querySelector('.timeline-details');
    const toggle = entry.querySelector('.timeline-toggle');

    summary.addEventListener('click', () => {
      const openNow = entry.classList.toggle('open');
      toggle.setAttribute('aria-expanded', openNow ? 'true' : 'false');
      details.setAttribute('aria-hidden', !openNow);
    });

    summary.addEventListener('keypress', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.click();
      }
    });
  });

  // Scroll reveal: highlight active timeline entry
  function updateActiveTimeline() {
    let found = false;
    document.querySelectorAll('.timeline-entry').forEach(entry => {
      entry.classList.remove('active');
      const rect = entry.getBoundingClientRect();
      if (!found && rect.top + rect.height/2 > 80) {
        entry.classList.add('active');
        found = true;
      }
    });
  }
  window.addEventListener('scroll', updateActiveTimeline, { passive: true });
  updateActiveTimeline();
});
