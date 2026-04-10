/* ================================
   PIXELARTE — SCRIPT PRINCIPAL
================================ */

// ——— LOADER ———
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        // Triggar animações hero
        document.querySelectorAll('header .reveal-up').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 120);
        });
    }, 1600);
});

// ——— CURSOR PERSONALIZADO ———
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Efeito hover em links
    document.querySelectorAll('a, button, .project-card, .sobre-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            follower.style.width = '56px';
            follower.style.height = '56px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '12px';
            cursor.style.height = '12px';
            follower.style.width = '36px';
            follower.style.height = '36px';
        });
    });
}

// ——— NAVBAR SCROLL ———
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ——— MOBILE MENU ———
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ——— PARALLAX REAL ———
function updateParallax() {
    const scrollY = window.scrollY;
    document.querySelectorAll('.parallax-wrapper').forEach(wrapper => {
        const section = wrapper.closest('section') || wrapper.parentElement;
        const rect = section.getBoundingClientRect();
        const speed = parseFloat(wrapper.dataset.parallax) || 0.3;

        // Só anima quando visível
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            const offset = (rect.top / window.innerHeight) * speed * 300;
            wrapper.querySelector('.parallax-bg').style.transform = `translateY(${offset}px)`;
        }
    });
}

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();

// ——— INTERSECTION OBSERVER (REVEAL ANIMATIONS) ———
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || 0;
            setTimeout(() => el.classList.add('visible'), parseInt(delay));
            revealObserver.unobserve(el);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    // Não observar os que já foram visibilizados pelo loader (hero)
    if (!el.closest('header')) {
        revealObserver.observe(el);
    }
});

// ——— SKILL BARS ANIMADAS ———
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
                const targetWidth = bar.dataset.width;
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, i * 150);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

// ——— CONTADOR ANIMADO (STATS) ———
function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) { start = target; clearInterval(timer); }
        el.textContent = Math.floor(start);
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(el => {
                animateCounter(el, parseInt(el.dataset.target));
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    // Triggar assim que loader terminar
    setTimeout(() => animateStats(), 2000);
    function animateStats() {
        document.querySelectorAll('.stat-number').forEach(el => {
            animateCounter(el, parseInt(el.dataset.target));
        });
    }
}

// ——— BACK TO TOP ———
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ——— SMOOTH SCROLL para links internos ———
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ——— ACTIVE NAV LINK on scroll ———
const sections = document.querySelectorAll('header, section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--white)';
        }
    });
}, { passive: true });

// ——— TABS DE SERVIÇOS ———
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        // Atualizar botões
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Atualizar painéis
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const target = document.querySelector(`.tab-panel[data-panel="${tab}"]`);
        if (target) {
            target.classList.add('active');
            // Re-triggar animações do painel
            target.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), 80);
            });
        }
    });
});

// Triggar painel inicial visível
document.querySelector('.tab-panel.active')?.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 200);
});
