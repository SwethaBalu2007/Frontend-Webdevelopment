/* ============================================
   JavaScript — Event Registration Page
   Pure frontend, no backend
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== Interactive Canvas Background ==========
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let mouseX = -1000;
    let mouseY = -1000;
    let particles = [];
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_RADIUS = 200;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.color = this.getRandomColor();
            this.alpha = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        getRandomColor() {
            const colors = [
                { r: 108, g: 99, b: 255 },   // Purple
                { r: 255, g: 101, b: 132 },   // Pink
                { r: 0, g: 212, b: 170 },     // Teal
                { r: 139, g: 133, b: 255 },   // Light Purple
                { r: 255, g: 175, b: 43 },    // Amber
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update(time) {
            // Normal drift movement
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;

            // Mouse interaction — particles push away from cursor
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 3;
                this.y += Math.sin(angle) * force * 3;
            }

            // Pulse effect
            this.currentAlpha = this.alpha + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`;
            ctx.fill();

            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha * 0.15})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Connection to mouse
            const dmx = particles[i].x - mouseX;
            const dmy = particles[i].y - mouseY;
            const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);

            if (mouseDist < MOUSE_RADIUS) {
                const opacity = (1 - mouseDist / MOUSE_RADIUS) * 0.3;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    function animateCanvas(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update(time);
            p.draw();
        });

        drawConnections();
        requestAnimationFrame(animateCanvas);
    }

    requestAnimationFrame(animateCanvas);

    // ========== Mouse Glow Effect ==========
    const mouseGlow = document.createElement('div');
    mouseGlow.classList.add('mouse-glow');
    document.body.appendChild(mouseGlow);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
        mouseGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
        mouseGlow.style.opacity = '0';
    });

    // ========== Navbar Scroll Effect ==========
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button
        const scrollBtn = document.getElementById('scrollTopBtn');
        if (window.scrollY > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }

        // Active nav link
        updateActiveNavLink();
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ========== Active Nav Link on Scroll ==========
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id], header[id], footer[id]');
        const links = document.querySelectorAll('.nav-links a');
        let current = '';

        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ========== Scroll to Top ==========
    document.getElementById('scrollTopBtn').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== Animated Counter (Hero Stats) ==========
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;
        counterAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const start = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    // Trigger counters when hero is in view
    const heroObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounters();
        }
    }, { threshold: 0.3 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) heroObserver.observe(heroSection);

    // ========== Scroll Animations ==========
    const animateElements = document.querySelectorAll('.detail-card, .form-fieldset, .table-wrapper, .footer-grid');
    animateElements.forEach(el => el.classList.add('animate-on-scroll'));

    const scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => scrollObserver.observe(el));

    // ========== File Upload UI ==========
    const fileInput = document.getElementById('id_proof');
    const fileUploadArea = document.getElementById('fileUploadArea');

    if (fileInput && fileUploadArea) {
        fileInput.addEventListener('change', () => {
            const textEl = fileUploadArea.querySelector('.file-upload-text');
            const hintEl = fileUploadArea.querySelector('.file-upload-hint');
            if (fileInput.files.length > 0) {
                textEl.textContent = fileInput.files[0].name;
                hintEl.textContent = (fileInput.files[0].size / 1024).toFixed(1) + ' KB';
                fileUploadArea.classList.add('has-file');
            } else {
                textEl.textContent = 'Click to upload or drag & drop';
                hintEl.textContent = 'PDF, JPG, PNG (max 5MB)';
                fileUploadArea.classList.remove('has-file');
            }
        });
    }

    // ========== Form Validation & Submission ==========
    const form = document.getElementById('registrationForm');
    const participantsBody = document.getElementById('participantsBody');
    const participantCountEl = document.getElementById('participantCount');
    let participantCount = 1; // Starting with 1 sample row

    // Event name mapping
    const eventNames = {
        'web_dev': 'Web Development Workshop',
        'ai_seminar': 'AI Seminar',
        'cyber_sec': 'Cybersecurity Panel'
    };

    const eventClasses = {
        'web_dev': 'web',
        'ai_seminar': 'ai',
        'cyber_sec': 'cyber'
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Gather data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim() || '—';
        const eventVal = document.getElementById('event').value;
        const eventName = eventNames[eventVal] || eventVal;
        const eventClass = eventClasses[eventVal] || 'web';

        // Get mode
        const modeInput = document.querySelector('input[name="mode"]:checked');
        const modeStr = modeInput ? modeInput.value : 'Not specified';
        const modeClass = modeStr === 'Online' ? 'online' : 'offline';

        participantCount++;

        // Create new row with animation
        const tr = document.createElement('tr');
        tr.style.animation = 'fadeInUp 0.5s ease forwards';
        tr.innerHTML = `
            <td>${escapeHtml(name)}</td>
            <td>${escapeHtml(email)}</td>
            <td>${escapeHtml(phone)}</td>
            <td>${escapeHtml(eventName)}</td>
            <td>${escapeHtml(modeStr)}</td>
        `;

        participantsBody.appendChild(tr);
        participantCountEl.textContent = participantCount;

        // Show success toast
        showToast();

        // Reset form
        form.reset();
        clearErrors();

        // Reset file upload UI
        if (fileUploadArea) {
            const textEl = fileUploadArea.querySelector('.file-upload-text');
            const hintEl = fileUploadArea.querySelector('.file-upload-hint');
            textEl.textContent = 'Click to upload or drag & drop';
            hintEl.textContent = 'PDF, JPG, PNG (max 5MB)';
            fileUploadArea.classList.remove('has-file');
        }

        // Scroll to participants
        setTimeout(() => {
            document.getElementById('participants').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    });

    // Reset button handling
    document.getElementById('resetBtn').addEventListener('click', () => {
        clearErrors();
        if (fileUploadArea) {
            const textEl = fileUploadArea.querySelector('.file-upload-text');
            const hintEl = fileUploadArea.querySelector('.file-upload-hint');
            textEl.textContent = 'Click to upload or drag & drop';
            hintEl.textContent = 'PDF, JPG, PNG (max 5MB)';
            fileUploadArea.classList.remove('has-file');
        }
    });

    // ========== Validation ==========
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Name
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            showError('name', 'nameError', 'Please enter your full name');
            isValid = false;
        }

        // Email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError('email', 'emailError', 'Please enter your email address');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError('email', 'emailError', 'Please enter a valid email address');
            isValid = false;
        }

        // Phone (optional but validate format if entered)
        const phone = document.getElementById('phone');
        if (phone.value.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                showError('phone', 'phoneError', 'Please enter a valid phone number');
                isValid = false;
            }
        }

        // Event
        const event = document.getElementById('event');
        if (!event.value) {
            event.classList.add('error');
            isValid = false;
        }

        // Declaration
        const declaration = document.getElementById('declaration');
        if (!declaration.checked) {
            declaration.closest('.declaration-box').style.borderColor = '#FF6584';
            isValid = false;
        }

        return isValid;
    }

    function showError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.classList.add('error');
        if (error) error.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        const declBox = document.querySelector('.declaration-box');
        if (declBox) declBox.style.borderColor = '';
    }

    // Real-time validation
    ['name', 'email', 'phone'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorEl = document.getElementById(id + 'Error');
                if (errorEl) errorEl.textContent = '';
            });
        }
    });

    document.getElementById('event').addEventListener('change', function () {
        this.classList.remove('error');
    });

    document.getElementById('declaration').addEventListener('change', function () {
        const box = this.closest('.declaration-box');
        if (box) box.style.borderColor = '';
    });

    // ========== Toast ==========
    function showToast() {
        const toast = document.getElementById('successToast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    document.getElementById('toastClose').addEventListener('click', () => {
        document.getElementById('successToast').classList.remove('show');
    });

    // ========== Utility ==========
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // ========== Smooth Scroll for Navigation ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
