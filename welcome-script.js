
// Welcome Page Script
class WelcomePage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createBackgroundCharts();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Main quote click - redirect to main app
        const mainQuote = document.getElementById('main-quote');
        mainQuote.addEventListener('click', () => {
            this.navigateToApp();
        });

        // Navigation buttons
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');

        loginBtn.addEventListener('click', () => {
            this.showLoginModal();
        });

        registerBtn.addEventListener('click', () => {
            this.showRegisterModal();
        });

        // Modal controls
        this.setupModalControls();
        
        // Form submissions
        this.setupFormHandlers();
    }

    setupModalControls() {
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        const closeLogin = document.getElementById('close-login');
        const closeRegister = document.getElementById('close-register');
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');

        // Close modals
        closeLogin.addEventListener('click', () => {
            this.hideModal(loginModal);
        });

        closeRegister.addEventListener('click', () => {
            this.hideModal(registerModal);
        });

        // Switch between modals
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal(loginModal);
            this.showRegisterModal();
        });

        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal(registerModal);
            this.showLoginModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                this.hideModal(loginModal);
            }
            if (e.target === registerModal) {
                this.hideModal(registerModal);
            }
        });
    }

    setupFormHandlers() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    navigateToApp() {
        // Add a smooth transition effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 500);
    }

    showLoginModal() {
        const modal = document.getElementById('login-modal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    showRegisterModal() {
        const modal = document.getElementById('register-modal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Validation
        if (!email || !password) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
        if (!users[email]) {
            this.showNotification('البريد الإلكتروني غير مسجل، يرجى إنشاء حساب جديد', 'error');
            return;
        }

        if (users[email].password !== password) {
            this.showNotification('كلمة المرور غير صحيحة', 'error');
            return;
        }

        // Simulate login process
        this.showLoadingMessage('جاري تسجيل الدخول...');
        
        setTimeout(() => {
            // Store user session with unique user ID
            const userId = this.generateUserId(email);
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('currentUserId', userId);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', users[email].name);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            // Hide loading message
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
            
            // Show success notification
            this.showNotification(`تم تسجيل الدخول بنجاح! أهلاً بك مرة أخرى ${users[email].name}`, 'success');
            
            // Navigate to app after notification shows
            setTimeout(() => {
                this.navigateToApp();
            }, 1500);
        }, 1500);
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        if (name.length < 2) {
            this.showNotification('الاسم يجب أن يكون حرفين على الأقل', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('كلمات المرور غير متطابقة', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showNotification('يجب الموافقة على شروط الاستخدام', 'error');
            return;
        }

        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
        if (users[email]) {
            this.showNotification('البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول', 'error');
            return;
        }

        // Simulate registration process
        this.showLoadingMessage('جاري إنشاء حسابك...');
        
        setTimeout(() => {
            // Store user data in users database
            users[email] = {
                name: name,
                password: password,
                registrationDate: new Date().toISOString()
            };
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            // Store user session with unique user ID
            const userId = this.generateUserId(email);
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('currentUserId', userId);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            localStorage.setItem('registrationDate', new Date().toISOString());
            
            // Hide loading message
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
            
            // Show success notification
            this.showNotification(`تم إنشاء حسابك بنجاح! مرحباً بك ${name} في مفكرة التداول`, 'success');
            
            // Navigate to app after notification shows
            setTimeout(() => {
                this.navigateToApp();
            }, 2000);
        }, 2000);
    }

    showLoadingMessage(message) {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            color: white;
            font-size: 1.2rem;
        `;
        
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 40px; height: 40px; border: 3px solid #fff; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>${message}</p>
            </div>
        `;
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loadingOverlay);
    }

    showNotification(message, type = 'success') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-times-circle';
        else if (type === 'warning') icon = 'fa-exclamation-triangle';
        else if (type === 'info') icon = 'fa-info-circle';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after different times based on type
        const autoRemoveTime = type === 'error' ? 7000 : 5000;
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('notification-fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, autoRemoveTime);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    generateUserId(email) {
        return btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    createBackgroundCharts() {
        this.createChart1();
        this.createChart2();
    }

    createChart1() {
        const ctx = document.getElementById('bgChart1');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', ''],
                datasets: [{
                    data: [100, 120, 110, 140, 130, 160],
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                interaction: {
                    intersect: false
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                }
            }
        });
    }

    createChart2() {
        const ctx = document.getElementById('bgChart2');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [65, 35],
                    backgroundColor: [
                        'rgba(255, 255, 255, 0.3)',
                        'rgba(255, 255, 255, 0.1)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '60%'
            }
        });
    }

    setupAnimations() {
        // Add hover effects to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.05)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add click effect to main quote
        const mainQuote = document.getElementById('main-quote');
        mainQuote.addEventListener('mousedown', () => {
            mainQuote.style.transform = 'scale(0.98)';
        });

        mainQuote.addEventListener('mouseup', () => {
            mainQuote.style.transform = 'scale(1)';
        });

        // Animate floating icons with random movement
        this.animateFloatingIcons();
    }

    animateFloatingIcons() {
        const icons = document.querySelectorAll('.floating-icon');
        icons.forEach(icon => {
            setInterval(() => {
                const randomX = Math.random() * 50 - 25;
                const randomY = Math.random() * 50 - 25;
                icon.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
            }, 3000 + Math.random() * 2000);
        });
    }
}

// Initialize the welcome page
document.addEventListener('DOMContentLoaded', () => {
    new WelcomePage();
});

// Add some inspirational quotes that can rotate
const inspirationalQuotes = [
    "اجعل خسارتك دروساً لنجاحك",
    "النجاح في التداول يحتاج إلى صبر وانضباط",
    "تعلم من أخطائك واجعلها قوة للمستقبل",
    "الخسارة ليست نهاية العالم بل بداية التعلم",
    "المتداول الناجح يخطط للمخاطر قبل الأرباح"
];

// Optional: Rotate quotes every 10 seconds
setInterval(() => {
    const quoteElement = document.getElementById('main-quote');
    if (quoteElement) {
        const currentQuote = quoteElement.textContent.trim();
        const quotes = inspirationalQuotes.filter(q => !currentQuote.includes(q));
        if (quotes.length > 0) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteElement.innerHTML = `
                <i class="fas fa-quote-right"></i>
                ${randomQuote}
                <i class="fas fa-quote-left"></i>
            `;
        }
    }
}, 10000);
