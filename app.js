document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const updateProgressBar = () => {
            const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = window.scrollY;
            progressBar.style.width = `${(scrolled / scrollTotal) * 100}%`;
        };
        window.addEventListener('scroll', updateProgressBar);
        updateProgressBar();
    }

    // --- Fade-in on Scroll ---
    const faders = document.querySelectorAll('.fade-in-on-scroll');
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -100px 0px', threshold: 0.1 });
    faders.forEach(fader => appearOnScroll.observe(fader));

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 20; // 20px offset from top
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Navigation Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (sections.length && navLinks.length) {
        const highlightNavigation = () => {
            let current = '';
            const scrollPosition = window.scrollY + 200; // Offset to trigger highlight sooner
            sections.forEach(section => {
                if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.clientHeight) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', highlightNavigation);
        highlightNavigation();
    }

    // --- Grant Writing Charts ---
    const brandPalette = {
        primaryOrange: '#ff724f',
        creamLight: '#fef5da',
        navyBlue: '#3a668c',
        goldenYellow: '#fdb92e',
        brownAccent: '#bd7f22'
    };

    function createChart(elementId, config) {
        const ctx = document.getElementById(elementId);
        if (ctx) {
            new Chart(ctx, config);
        }
    }

    // Waste Composition Chart
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

    // Job Creation Chart
    createChart('jobCreationChart', {
        type: 'bar',
        data: {
            labels: ['Composting', 'Landfilling', 'Incineration'],
            datasets: [{ label: 'Jobs per 10,000 Tons/Year', data: [4.1, 2.1, 1.2], backgroundColor: [brandPalette.goldenYellow, brandPalette.navyBlue, brandPalette.brownAccent] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } }, x: { ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } } } }
    });

    // Market Growth Chart
    createChart('marketGrowthChart', {
        type: 'line',
        data: {
            labels: ['2024', '2026', '2028', '2030', '2032'],
            datasets: [{ label: 'Market Value ($B)', data: [1.4, 1.65, 1.9, 2.2, 2.5], borderColor: brandPalette.primaryOrange, backgroundColor: 'rgba(255, 114, 79, 0.1)', fill: true, tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } }, x: { ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } } } }
    });

    // Implementation Timeline Chart
    createChart('implementationChart', {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2-3', 'Year 4-5'],
            datasets: [{ label: 'Municipalities', data: [100, 1000, 2000], backgroundColor: [brandPalette.goldenYellow, brandPalette.primaryOrange, brandPalette.navyBlue] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } }, x: { ticks: { color: brandPalette.creamLight }, grid: { color: 'rgba(254, 245, 218, 0.1)' } } } }
    });
});
