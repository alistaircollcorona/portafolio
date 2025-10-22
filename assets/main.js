const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('preferred-theme');

function applyTheme(theme) {
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.setAttribute('aria-pressed', 'true');
        themeToggle.textContent = 'Switch to Light Mode';
    } else if (theme === 'light') {
        body.setAttribute('data-theme', 'light');
        themeToggle.setAttribute('aria-pressed', 'false');
        themeToggle.textContent = 'Use System Theme';
    } else {
        body.removeAttribute('data-theme');
        themeToggle.setAttribute('aria-pressed', 'mixed');
        themeToggle.textContent = 'Switch to Dark Mode';
    }
}

if (storedTheme) {
    applyTheme(storedTheme);
} else {
    applyTheme(null);
}

themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    let next;
    if (current === 'dark') {
        next = 'light';
    } else if (current === 'light') {
        next = null;
    } else {
        next = 'dark';
    }

    if (next) {
        localStorage.setItem('preferred-theme', next);
    } else {
        localStorage.removeItem('preferred-theme');
    }
    applyTheme(next);
});

document.getElementById('year').textContent = new Date().getFullYear();

const revealSections = document.querySelectorAll('.reveal');
const supportsMotionQuery = typeof window.matchMedia === 'function';
const prefersReducedMotion = supportsMotionQuery ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
let revealObserver;

const observeSections = () => {
    if (revealObserver) {
        revealObserver.disconnect();
    }
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (revealObserver) {
                    revealObserver.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.18,
    });

    revealSections.forEach((section) => {
        if (!section.classList.contains('is-visible')) {
            revealObserver.observe(section);
        }
    });
};

const showAllSections = () => {
    if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
    }
    revealSections.forEach((section) => section.classList.add('is-visible'));
};

if (prefersReducedMotion && prefersReducedMotion.matches) {
    showAllSections();
} else {
    observeSections();
}

const handleMotionPreference = (event) => {
    if (event.matches) {
        showAllSections();
    } else {
        revealSections.forEach((section) => section.classList.remove('is-visible'));
        observeSections();
    }
};

if (prefersReducedMotion) {
    if (typeof prefersReducedMotion.addEventListener === 'function') {
        prefersReducedMotion.addEventListener('change', handleMotionPreference);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
        prefersReducedMotion.addListener(handleMotionPreference);
    }
}

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        formMessage.textContent = 'Please complete all fields before sending.';
        formMessage.style.color = '#b1403f';
        return;
    }

    if (!emailRegex.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.style.color = '#b1403f';
        return;
    }

    formMessage.textContent = 'Thank you. Your message is ready to send.';
    formMessage.style.color = 'var(--accent-strong)';
    form.reset();
});
