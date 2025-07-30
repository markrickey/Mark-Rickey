/* app.js – Interactive behaviors for Mark's AI Leadership Research */

(function () {
  const sectionEls = document.querySelectorAll('.fade-section, .hero-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const progressBar = document.getElementById('progressBar');

  /* IntersectionObserver to fade sections into view */
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Highlight nav link
          const id = entry.target.getAttribute('id');
          if (id) {
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  sectionEls.forEach((sec) => fadeObserver.observe(sec));

  /* Update progress bar */
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* Toggle Buttons - Fixed Implementation */
  document.querySelectorAll('.toggle-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const contentEl = document.getElementById(targetId);
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Update button state and text
      btn.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        btn.textContent = btn.textContent.replace('Hide', 'Show');
        contentEl.classList.remove('visible');
        contentEl.classList.add('hidden');
      } else {
        btn.textContent = btn.textContent.replace('Show', 'Hide');
        contentEl.classList.remove('hidden');
        contentEl.classList.add('visible');
      }
    });
  });

  /* Salary Toggle */
  const salaryButtons = document.querySelectorAll('.salary-toggle');
  const salaryColumnLabel = document.getElementById('salaryColumnLabel');

  salaryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      // Update active state
      salaryButtons.forEach((b) => b.classList.toggle('active', b === btn));
      salaryColumnLabel.textContent = type === 'top' ? 'Top Performers' : 'Average';
      // Update each salary cell
      document.querySelectorAll('.salary-table td[data-average]').forEach((cell) => {
        cell.textContent = cell.getAttribute(type === 'top' ? 'data-top' : 'data-average');
      });
    });
  });

  /* 24-Month Roadmap Timeline - Fixed Implementation */
  const phases = [
    {
      name: 'Foundation Building',
      duration: 'Months 1–6',
      focus: 'Developing comprehensive AI literacy, conducting capability assessments, establishing ethical frameworks',
      activities: [
        'Invest in prompt engineering training',
        'Hands-on experience with leading AI tools',
        'Benchmark current strategic leadership effectiveness',
        'Develop personal ethical frameworks',
      ],
    },
    {
      name: 'Strategic Integration',
      duration: 'Months 6–12',
      focus: 'Implementing human-AI collaboration in low-risk applications before expanding to complex strategic functions',
      activities: [
        'Start with research and data analysis applications',
        'Enhance emotional intelligence and negotiation skills',
        'Launch thought leadership platforms',
        'Demonstrate AI-augmented strategic leadership expertise',
      ],
    },
    {
      name: 'Optimization',
      duration: 'Months 12–24',
      focus: 'Scaling AI integration across all strategic functions while maintaining human oversight',
      activities: [
        'Scale AI integration across strategic functions',
        'Mentor colleagues in best practices',
        'Lead organizational transformation initiatives',
        'Demonstrate tangible business value',
      ],
    },
  ];

  const timelineButtons = document.querySelectorAll('.timeline__item');
  const phaseDetailsEl = document.getElementById('phaseDetails');

  function renderPhase(idx) {
    const phase = phases[idx];
    if (!phase) return;
    
    // Update active button
    timelineButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });
    
    // Add fade out effect, then update content
    phaseDetailsEl.style.opacity = '0';
    phaseDetailsEl.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      // Build HTML
      phaseDetailsEl.innerHTML = `
        <h3>${phase.name}</h3>
        <p class="duration">${phase.duration}</p>
        <p class="focus">${phase.focus}</p>
        <ul>
          ${phase.activities.map((act) => `<li>${act}</li>`).join('')}
        </ul>
      `;
      
      // Fade back in
      phaseDetailsEl.style.opacity = '1';
      phaseDetailsEl.style.transform = 'translateY(0)';
    }, 150);
  }

  timelineButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-phase'), 10);
      renderPhase(idx);
    });
  });

  // Initialize phase details with transition
  phaseDetailsEl.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
  
  // Initial render first phase
  renderPhase(0);

  /* Footer Year */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Smooth scroll for navigation links */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const offsetTop = targetEl.offsetTop - 80; // Account for fixed nav
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
})();