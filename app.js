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

    // --- Active Navigation Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (sections.length && navLinks.length) {
        const highlightNavigation = () => {
            let current = '';
            const scrollPosition = window.scrollY + 200;
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
    // This flag ensures we only initialize the charts once.
    let grantChartsInitialized = false;

    function initGrantCharts() {
        // If they're already drawn, do nothing.
        if (grantChartsInitialized) return;

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

        // Create all the charts
        createChart('wasteCompositionChart', { /* ... chart config ... */ });
        createChart('jobCreationChart', { /* ... chart config ... */ });
        createChart('marketGrowthChart', { /* ... chart config ... */ });
        createChart('implementationChart', { /* ... chart config ... */ });

        // Set the flag to true so we don't run this again.
        grantChartsInitialized = true;
    }


    // --- Fade-in on Scroll & Chart Initialization Trigger ---
    const grantSection = document.getElementById('services'); // The ID of your grant/services section
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'is-visible' class to trigger the fade-in animation
                entry.target.classList.add('is-visible');

                // ** NEW: If the intersecting element is the grant section, draw the charts **
                if (entry.target.id === 'services') {
                    initGrantCharts();
                }

                // Stop observing the element after it has faded in
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -100px 0px', threshold: 0.1 });

    // Observe all elements that need to fade in
    document.querySelectorAll('.fade-in-on-scroll').forEach(fader => {
        observer.observe(fader);
    });

});
