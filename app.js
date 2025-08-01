document.addEventListener('DOMContentLoaded', () => {
    // Google Sheets API URL - VERIFY THIS IS COMPLETE
    const API_URL = "https://script.google.com/macros/s/AKfycbzeHzVAswHUPbO0AjGNvSnIxVuaaiyECQUPUmrfV1IuLE5n5wfmD4-vLyoVJxhPltMw/exec";

    // --- Scroll Progress Bar Logic ---
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const updateProgressBar = () => {
            const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / scrollTotal) * 100;
            progressBar.style.width = `${progress}%`;
        };
        window.addEventListener('scroll', updateProgressBar);
        updateProgressBar(); // Initial run
    }

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
    if (sections.length && navigationLinks.length) {
        const highlightNavigation = () => {
            let current = '';
            const scrollPosition = window.scrollY + 200;
            sections.forEach(section => {
                if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.clientHeight) {
                    current = section.getAttribute('id');
                }
            });
            navigationLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', highlightNavigation);
        highlightNavigation(); // Initial run
    }

    // --- Blog Loader ---
    const blogFeed = document.getElementById('blogFeed');
    function loadPosts() {
        if (!blogFeed) return;
        fetch(API_URL)
            .then(r => r.json())
            .then(posts => {
                let html = '';
                posts.reverse().forEach(post => {
                    // Using CSS for spacing is better than <br>, but this works
                    html += `
                        <div class="blog-post">
                          <p>${post.post}</p>
                          <small>${new Date(post.timestamp).toLocaleString()} by ${post.author}</small>
                          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.url)}" target="_blank">Share on LinkedIn</a>
                        </div>
                    `;
                });
                blogFeed.innerHTML = html;
            }).catch(error => console.error('Error loading blog posts:', error));
    }
    loadPosts();

    // --- Admin Reveal & Form ---
    // See security warning below
    const revealAdminBtn = document.getElementById('revealAdminBtn');
    const adminPostForm = document.getElementById('adminPostForm');
    if (revealAdminBtn && adminPostForm) {
        revealAdminBtn.onclick = function () {
            // WARNING: This is not secure. Password is visible in the source code.
            if (prompt("Admin access: what is the code?") === "Manila92!") {
                adminPostForm.style.display = 'block';
                this.style.display = 'none';
            }
        };
    }

    const blogPostForm = document.getElementById('blogPostForm');
    if (blogPostForm) {
        blogPostForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const postContentInput = document.getElementById('blogPost');
            const postContent = postContentInput.value;
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
                    postContentInput.value = '';
                    loadPosts();
                } else {
                    alert("There was a problem. Please try again.");
                }
            }).catch(error => console.error('Error submitting post:', error));
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

    // Chart initialization logic
    function createChart(elementId, config) {
        const ctx = document.getElementById(elementId);
        if (ctx) {
            new Chart(ctx, config);
        }
    }

    createChart('wasteCompositionChart', {
        type: 'doughnut',
        data: {
            labels: ['Food Waste', 'Yard Trimmings', 'Paper', 'Plastics', 'Other'],
            datasets: [{
                data: [24, 13, 12, 18, 33],
                backgroundColor: [brandPalette.primaryOrange, brandPalette.goldenYellow, brandPalette.navyBlue, brandPalette.brownAccent, '#cccccc'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: brandPalette.creamLight } } } }
    });

    createChart('jobCreationChart', {
        type: 'bar',
        data: {
            labels: ['Composting', 'Landfilling', 'Incineration'],
            datasets: [{ label: 'Jobs per 10,000 Tons/Year', data: [4.1, 2.1, 1.2], backgroundColor: [brandPalette.goldenYellow, brandPalette.navyBlue, brandPalette.brownAccent] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } }, x: { ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } } } }
    });

    createChart('marketGrowthChart', {
        type: 'line',
        data: {
            labels: ['2024', '2026', '2028', '2030', '2032'],
            datasets: [{ label: 'Market Value ($B)', data: [1.4, 1.65, 1.9, 2.2, 2.5], borderColor: brandPalette.primaryOrange, backgroundColor: 'rgba(255, 114, 79, 0.1)', fill: true, tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } }, x: { ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } } } }
    });

    createChart('implementationChart', {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2-3', 'Year 4-5'],
            datasets: [{ label: 'Municipalities', data: [100, 1000, 2000], backgroundColor: [brandPalette.goldenYellow, brandPalette.primaryOrange, brandPalette.navyBlue] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } }, x: { ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } } } }
    });
});
