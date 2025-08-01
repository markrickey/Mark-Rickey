document.addEventListener('DOMContentLoaded', () => {
    // Google Sheets API URL - VERIFY THIS IS COMPLETE
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

    // --- Contact Form Handling (Updated to match your HTML form) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            // Don't prevent default since you're using FormSubmit
            // But you can add additional handling here if needed
            console.log("Contact form submitted");
        });
    }

    // --- Grant Writing Charts Script ---
    const brandPalette = {
        primaryOrange: '#ff724f',
        creamLight: '#fef5da',
        navyBlue: '#3a668c',
        goldenYellow: '#fdb92e',
        brownAccent: '#bd7f22'
    };

    // Waste Composition Chart
    const wasteCtx = document.getElementById('wasteCompositionChart');
    if (wasteCtx) {
        new Chart(wasteCtx, {
            type: 'doughnut',
            data: {
                labels: ['Food Waste', 'Yard Trimmings', 'Paper', 'Plastics', 'Other'],
                datasets: [{
                    data: [24, 13, 12, 18, 33],
                    backgroundColor: [
                        brandPalette.primaryOrange,
                        brandPalette.goldenYellow,
                        brandPalette.navyBlue,
                        brandPalette.brownAccent,
                        '#cccccc'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fef5da' }
                    }
                }
            }
        });
    }

    // Job Creation Chart
    const jobCtx = document.getElementById('jobCreationChart');
    if (jobCtx) {
        new Chart(jobCtx, {
            type: 'bar',
            data: {
                labels: ['Composting', 'Landfilling', 'Incineration'],
                datasets: [{
                    label: 'Jobs per 10,000 Tons/Year',
                    data: [4.1, 2.1, 1.2],
                    backgroundColor: [
                        brandPalette.goldenYellow,
                        brandPalette.navyBlue,
                        brandPalette.brownAccent
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fef5da' },
                        grid: { color: 'rgba(254, 245, 218, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#fef5da' },
                        grid: { color: 'rgba(254, 245, 218, 0.1)' }
                    }
                }
            }
        });
    }

    // Market Growth Chart
    const marketCtx = document.getElementById('marketGrowthChart');
    if (marketCtx) {
        new Chart(marketCtx, {
            type: 'line',
            data: {
                labels: ['2024', '2026', '2028', '2030', '2032'],
                datasets: [{
                    label: 'Market Value ($B)',
                    data: [1.4, 1.65, 1.9, 2.2, 2.5],
                    borderColor: brandPalette.primaryOrange,
                    backgroundColor: 'rgba(255, 114, 79, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { color: '#fef5da' },
                        grid: { color: 'rgba(254, 245, 218, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#fef5da' },
                        grid: { color: 'rgba(254, 245, 218, 0.1)' }
                    }
                }
            }
        });
    }

    // Implementation Timeline Chart
    const implementationCtx = document.getElementById('implementationChart');
    if (implementationCtx) {
        new Chart(implementationCtx, {
            type: 'bar',
            data: {
                labels: ['Year 1', 'Year 2-3', 'Year 4-5'],
                datasets: [{
                    label: 'Municipalities',
                    data: [100, 1000, 2000],
                    backgroundColor: [
                        brandPalette.goldenYellow,
                        brandPalette.primaryOrange,
                        brandPalette.navyBlue
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fef5da' },
                        grid: { color: 'rgba(254, 245, 218, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#fef5da' },
                        grid: { color: 'rgba(254, 245, 218, 0.1)' }
                    }
                }
            }
        });
    }

    // --- Rest of your existing code for hover effects, etc. ---
    // Project Cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-8px)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
    });

    // Article Cards
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-4px)'; });
        card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
    });

    // Skill Tags
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

    // Add dynamic styles
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active { color: #DB7A4D !important; font-weight: 600; }
        .nav-link { transition: all 0.3s ease; }
        .skill-tag { transition: all 0.2s ease; cursor: pointer; }
        .project-card, .article-card { transition: all 0.3s ease;}
    `;
    document.head.appendChild(style);
});
