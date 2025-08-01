
// Trading Journal Application
class TradingJournal {
    constructor() {
        this.currentUserId = localStorage.getItem('currentUserId') || 'default';
        this.trades = JSON.parse(localStorage.getItem(`trades_${this.currentUserId}`)) || [];
        this.notes = JSON.parse(localStorage.getItem(`notes_${this.currentUserId}`)) || [];
        this.reviews = JSON.parse(localStorage.getItem(`reviews_${this.currentUserId}`)) || [];
        this.currentPage = 'dashboard';
        this.currentLanguage = localStorage.getItem(`language_${this.currentUserId}`) || 'ar';
        
        this.translations = {
            ar: {
                app_title: 'مفكرة التداول',
                dashboard: 'لوحة القيادة',
                add_trade: 'إضافة صفقة',
                trade_history: 'سجل الصفقات',
                analysis: 'تحليل الأداء',
                notes: 'الملاحظات',
                review: 'تقييم النفس',
                dashboard_desc: 'نظرة عامة على أداء التداول',
                total_profit_loss: 'إجمالي الأرباح/الخسائر',
                win_rate: 'نسبة الصفقات الرابحة',
                total_trades: 'إجمالي الصفقات',
                avg_profit: 'متوسط الربح/الخسارة',
                add_trade_title: 'إضافة صفقة جديدة',
                add_trade_desc: 'سجل تفاصيل صفقتك',
                trade_date: 'تاريخ الصفقة',
                asset: 'الأصل/زوج العملات',
                trade_type: 'نوع الصفقة',
                lot_size: 'حجم اللوت/العقد',
                entry_time: 'وقت الدخول',
                exit_time: 'وقت الخروج',
                entry_price: 'سعر الدخول',
                exit_price: 'سعر الخروج',
                exit_reason: 'سبب الخروج',
                entry_reason: 'سبب الدخول',
                trade_comment: 'التعليق الشخصي',
                entry_screenshot: 'صورة بداية الصفقة',
                exit_screenshot: 'صورة نتيجة الصفقة',
                save_trade: 'حفظ الصفقة',
                buy: 'شراء',
                sell: 'بيع',
                no_trades: 'لا توجد صفقات بعد'
            },
            en: {
                app_title: 'Trading Journal',
                dashboard: 'Dashboard',
                add_trade: 'Add Trade',
                trade_history: 'Trade History',
                analysis: 'Analysis',
                notes: 'Notes',
                review: 'Self Review',
                dashboard_desc: 'Overview of your trading performance',
                total_profit_loss: 'Total Profit/Loss',
                win_rate: 'Win Rate',
                total_trades: 'Total Trades',
                avg_profit: 'Average Profit/Loss',
                add_trade_title: 'Add New Trade',
                add_trade_desc: 'Record your trade details',
                trade_date: 'Trade Date',
                asset: 'Asset/Currency Pair',
                trade_type: 'Trade Type',
                lot_size: 'Lot/Contract Size',
                entry_time: 'Entry Time',
                exit_time: 'Exit Time',
                entry_price: 'Entry Price',
                exit_price: 'Exit Price',
                exit_reason: 'Exit Reason',
                entry_reason: 'Entry Reason',
                trade_comment: 'Personal Comment',
                entry_screenshot: 'Entry Screenshot',
                exit_screenshot: 'Exit Screenshot',
                save_trade: 'Save Trade',
                buy: 'Buy',
                sell: 'Sell',
                no_trades: 'No trades yet'
            }
        };
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.setupLanguageToggle();
        this.updateLanguage();
        this.updateDashboard();
        this.renderTradeHistory();
        this.renderNotes();
        this.renderReviews();
        this.setupAnalysis();
        this.setupCharts();
        this.setupRatings();
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.showPage(page);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showPage(pageId) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        this.currentPage = pageId;
    }

    // Language Management
    setupLanguageToggle() {
        const languageToggle = document.getElementById('language-toggle');
        languageToggle.addEventListener('click', () => {
            this.toggleLanguage();
        });
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
        localStorage.setItem(`language_${this.currentUserId}`, this.currentLanguage);
        this.updateLanguage();
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });

        // Update document direction and language
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';

        // Update language toggle button
        const languageToggle = document.getElementById('language-toggle');
        languageToggle.innerHTML = `<i class="fas fa-globe"></i> ${this.currentLanguage === 'ar' ? 'EN' : 'AR'}`;

        // Update form placeholders and options
        this.updateFormTexts();
        
        // Re-render components to update language
        this.renderTradeHistory();
        this.updateDashboard();
    }

    updateFormTexts() {
        // Update placeholders and select options based on current language
        const assetInput = document.getElementById('asset');
        if (assetInput) {
            assetInput.placeholder = this.currentLanguage === 'ar' ? 'مثل: EUR/USD, الذهب' : 'e.g: EUR/USD, Gold';
        }

        const lotSizeInput = document.getElementById('lot-size');
        if (lotSizeInput) {
            lotSizeInput.placeholder = this.currentLanguage === 'ar' ? 'مثل: 0.1' : 'e.g: 0.1';
        }

        const entryReasonTextarea = document.getElementById('entry-reason');
        if (entryReasonTextarea) {
            entryReasonTextarea.placeholder = this.currentLanguage === 'ar' ? 
                'لماذا دخلت هذه الصفقة؟ ما الإشارات التي رأيتها؟' : 
                'Why did you enter this trade? What signals did you see?';
        }

        const tradeCommentTextarea = document.getElementById('trade-comment');
        if (tradeCommentTextarea) {
            tradeCommentTextarea.placeholder = this.currentLanguage === 'ar' ? 
                'ملاحظاتك بعد إغلاق الصفقة' : 
                'Your notes after closing the trade';
        }

        // Update select options
        this.updateSelectOptions();
    }

    updateSelectOptions() {
        const tradeTypeSelect = document.getElementById('trade-type');
        if (tradeTypeSelect) {
            tradeTypeSelect.innerHTML = this.currentLanguage === 'ar' ? `
                <option value="">اختر نوع الصفقة</option>
                <option value="buy">شراء (Buy)</option>
                <option value="sell">بيع (Sell)</option>
            ` : `
                <option value="">Choose trade type</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
            `;
        }

        const exitReasonSelect = document.getElementById('exit-reason');
        if (exitReasonSelect) {
            exitReasonSelect.innerHTML = this.currentLanguage === 'ar' ? `
                <option value="">اختر سبب الخروج</option>
                <option value="SL">SL - Stop Loss (وقف الخسارة)</option>
                <option value="TP">TP - Take Profit (جني الأرباح)</option>
                <option value="PK">PK - Partial Close (إغلاق جزئي)</option>
                <option value="BE">BE - Break Even (إغلاق بدون خسارة أو ربح)</option>
                <option value="manual">إغلاق يدوي</option>
                <option value="other">أخرى</option>
            ` : `
                <option value="">Choose exit reason</option>
                <option value="SL">SL - Stop Loss</option>
                <option value="TP">TP - Take Profit</option>
                <option value="PK">PK - Partial Close</option>
                <option value="BE">BE - Break Even</option>
                <option value="manual">Manual Close</option>
                <option value="other">Other</option>
            `;
        }
    }

    // Forms Setup
    setupForms() {
        // Trade Form
        const tradeForm = document.getElementById('trade-form');
        tradeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTrade();
        });

        // Note Form
        const noteForm = document.getElementById('note-form');
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNote();
        });

        // Review Form
        const reviewForm = document.getElementById('review-form');
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addReview();
        });

        // Set today's date as default
        document.getElementById('trade-date').valueAsDate = new Date();

        // Setup filters
        this.setupFilters();
    }

    // Trade Management
    addTrade() {
        const form = document.getElementById('trade-form');
        const formData = new FormData(form);
        
        const trade = {
            id: Date.now(),
            date: document.getElementById('trade-date').value,
            asset: document.getElementById('asset').value,
            type: document.getElementById('trade-type').value,
            lotSize: parseFloat(document.getElementById('lot-size').value),
            entryTime: document.getElementById('entry-time').value,
            exitTime: document.getElementById('exit-time').value,
            entryPrice: parseFloat(document.getElementById('entry-price').value),
            exitPrice: parseFloat(document.getElementById('exit-price').value),
            exitReason: document.getElementById('exit-reason').value,
            entryReason: document.getElementById('entry-reason').value,
            comment: document.getElementById('trade-comment').value,
            entryScreenshot: document.getElementById('entry-screenshot').files[0]?.name || '',
            exitScreenshot: document.getElementById('exit-screenshot').files[0]?.name || '',
            createdAt: new Date().toISOString()
        };

        // Calculate profit/loss
        trade.result = this.calculateTradeResult(trade);
        
        this.trades.push(trade);
        this.saveTrades();
        
        // Reset form and show success message
        form.reset();
        document.getElementById('trade-date').valueAsDate = new Date();
        this.showNotification('تم حفظ الصفقة بنجاح!', 'success');
        
        // Update displays
        this.updateDashboard();
        this.renderTradeHistory();
        this.updateAssetFilter();
    }

    calculateTradeResult(trade) {
        const priceDiff = trade.type === 'buy' 
            ? trade.exitPrice - trade.entryPrice 
            : trade.entryPrice - trade.exitPrice;
        
        return priceDiff * trade.lotSize;
    }

    deleteTrade(id) {
        if (confirm('هل أنت متأكد من حذف هذه الصفقة؟')) {
            this.trades = this.trades.filter(trade => trade.id !== id);
            this.saveTrades();
            this.updateDashboard();
            this.renderTradeHistory();
        }
    }

    // Dashboard Updates
    updateDashboard() {
        const totalProfit = this.trades.reduce((sum, trade) => sum + trade.result, 0);
        const winningTrades = this.trades.filter(trade => trade.result > 0).length;
        const totalTrades = this.trades.length;
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100) : 0;
        const avgProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;

        document.getElementById('total-profit').textContent = `$${totalProfit.toFixed(2)}`;
        document.getElementById('win-rate').textContent = `${winRate.toFixed(1)}%`;
        document.getElementById('total-trades').textContent = totalTrades;
        document.getElementById('avg-profit').textContent = `$${avgProfit.toFixed(2)}`;

        // Update profit card color
        const profitCard = document.querySelector('.stat-card.profit');
        profitCard.className = `stat-card ${totalProfit >= 0 ? 'profit' : 'loss'}`;

        this.renderRecentTrades();
        this.updateCharts();
    }

    renderRecentTrades() {
        const container = document.getElementById('recent-trades-list');
        const recentTrades = this.trades.slice(-5).reverse();

        if (recentTrades.length === 0) {
            container.innerHTML = `<p class="no-data">${this.translations[this.currentLanguage].no_trades}</p>`;
            return;
        }

        container.innerHTML = recentTrades.map(trade => `
            <div class="trade-item">
                <div class="trade-info">
                    <h4>${trade.asset}</h4>
                    <p>${trade.date} - ${trade.type === 'buy' ? this.translations[this.currentLanguage].buy : this.translations[this.currentLanguage].sell}</p>
                </div>
                <div class="trade-result ${trade.result >= 0 ? 'profit' : 'loss'}">
                    $${trade.result.toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    // Trade History
    renderTradeHistory() {
        const tbody = document.getElementById('trades-tbody');
        
        if (this.trades.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="no-data">${this.translations[this.currentLanguage].no_trades}</td></tr>`;
            return;
        }

        const filteredTrades = this.getFilteredTrades();
        
        tbody.innerHTML = filteredTrades.map(trade => `
            <tr>
                <td>${trade.date}</td>
                <td>${trade.asset}</td>
                <td>${trade.type === 'buy' ? this.translations[this.currentLanguage].buy : this.translations[this.currentLanguage].sell}</td>
                <td>${trade.lotSize}</td>
                <td>${trade.entryPrice}</td>
                <td>${trade.exitPrice}</td>
                <td>${this.getExitReasonText(trade.exitReason)}</td>
                <td class="${trade.result >= 0 ? 'profit' : 'loss'}">$${trade.result.toFixed(2)}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="app.deleteTrade(${trade.id})">
                        ${this.currentLanguage === 'ar' ? 'حذف' : 'Delete'}
                    </button>
                </td>
            </tr>
        `).join('');
    }

    setupFilters() {
        const filters = ['asset-filter', 'type-filter', 'result-filter', 'date-filter'];
        filters.forEach(filterId => {
            document.getElementById(filterId).addEventListener('change', () => {
                this.renderTradeHistory();
            });
        });
        this.updateAssetFilter();
    }

    updateAssetFilter() {
        const assetFilter = document.getElementById('asset-filter');
        const assets = [...new Set(this.trades.map(trade => trade.asset))];
        
        assetFilter.innerHTML = '<option value="">جميع الأصول</option>' + 
            assets.map(asset => `<option value="${asset}">${asset}</option>`).join('');
    }

    getFilteredTrades() {
        let filtered = [...this.trades];
        
        const assetFilter = document.getElementById('asset-filter').value;
        const typeFilter = document.getElementById('type-filter').value;
        const resultFilter = document.getElementById('result-filter').value;
        const dateFilter = document.getElementById('date-filter').value;

        if (assetFilter) filtered = filtered.filter(trade => trade.asset === assetFilter);
        if (typeFilter) filtered = filtered.filter(trade => trade.type === typeFilter);
        if (resultFilter) {
            filtered = filtered.filter(trade => 
                resultFilter === 'profit' ? trade.result > 0 : trade.result <= 0
            );
        }
        if (dateFilter) filtered = filtered.filter(trade => trade.date === dateFilter);

        return filtered.reverse();
    }

    // Notes Management
    addNote() {
        const note = {
            id: Date.now(),
            title: document.getElementById('note-title').value,
            category: document.getElementById('note-category').value,
            content: document.getElementById('note-content').value,
            createdAt: new Date().toISOString()
        };

        this.notes.push(note);
        this.saveNotes();
        
        document.getElementById('note-form').reset();
        this.showNotification('تم حفظ الملاحظة بنجاح!', 'success');
        this.renderNotes();
    }

    renderNotes() {
        const container = document.getElementById('notes-container');
        
        if (this.notes.length === 0) {
            container.innerHTML = '<p class="no-data">لا توجد ملاحظات بعد</p>';
            return;
        }

        container.innerHTML = this.notes.slice().reverse().map(note => `
            <div class="note-item">
                <div class="note-header">
                    <span class="note-title">${note.title}</span>
                    <span class="note-category">${this.getCategoryName(note.category)}</span>
                </div>
                <p class="note-content">${note.content}</p>
                <div class="note-date">${new Date(note.createdAt).toLocaleDateString('ar-SA')}</div>
                <button class="btn btn-small btn-danger" onclick="app.deleteNote(${note.id})">
                    حذف
                </button>
            </div>
        `).join('');
    }

    getCategoryName(category) {
        const categories = {
            general: 'عام',
            strategy: 'استراتيجية',
            psychology: 'علم النفس',
            market: 'تحليل السوق',
            goals: 'الأهداف'
        };
        return categories[category] || category;
    }

    getExitReasonText(exitReason) {
        const reasons = {
            ar: {
                'SL': 'SL - وقف الخسارة',
                'TP': 'TP - جني الأرباح',
                'PK': 'PK - إغلاق جزئي',
                'BE': 'BE - إغلاق بدون خسارة أو ربح',
                'manual': 'إغلاق يدوي',
                'other': 'أخرى'
            },
            en: {
                'SL': 'SL - Stop Loss',
                'TP': 'TP - Take Profit',
                'PK': 'PK - Partial Close',
                'BE': 'BE - Break Even',
                'manual': 'Manual Close',
                'other': 'Other'
            }
        };
        return reasons[this.currentLanguage][exitReason] || exitReason || (this.currentLanguage === 'ar' ? 'غير محدد' : 'Not specified');
    }

    deleteNote(id) {
        if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.renderNotes();
        }
    }

    // Review Management
    setupRatings() {
        const ratings = document.querySelectorAll('input[type="range"]');
        ratings.forEach(rating => {
            rating.addEventListener('input', (e) => {
                const valueSpan = e.target.parentElement.querySelector('.rating-value');
                valueSpan.textContent = e.target.value;
            });
        });
    }

    addReview() {
        const review = {
            id: Date.now(),
            discipline: document.getElementById('discipline-rating').value,
            plan: document.getElementById('plan-rating').value,
            risk: document.getElementById('risk-rating').value,
            achievements: document.getElementById('achievements').value,
            mistakes: document.getElementById('mistakes').value,
            improvements: document.getElementById('improvements').value,
            createdAt: new Date().toISOString()
        };

        this.reviews.push(review);
        this.saveReviews();
        
        document.getElementById('review-form').reset();
        // Reset rating displays
        document.querySelectorAll('.rating-value').forEach(span => span.textContent = '5');
        document.querySelectorAll('input[type="range"]').forEach(input => input.value = '5');
        
        this.showNotification('تم حفظ التقييم بنجاح!', 'success');
        this.renderReviews();
    }

    renderReviews() {
        const container = document.getElementById('review-history-list');
        
        if (this.reviews.length === 0) {
            container.innerHTML = '<p class="no-data">لا توجد تقييمات سابقة</p>';
            return;
        }

        container.innerHTML = this.reviews.slice().reverse().map(review => `
            <div class="review-item">
                <h4>تقييم ${new Date(review.createdAt).toLocaleDateString('ar-SA')}</h4>
                <div class="review-ratings">
                    <p><strong>الانضباط:</strong> ${review.discipline}/10</p>
                    <p><strong>الالتزام بالخطة:</strong> ${review.plan}/10</p>
                    <p><strong>إدارة المخاطر:</strong> ${review.risk}/10</p>
                </div>
                <div class="review-content">
                    <p><strong>الإنجازات:</strong> ${review.achievements}</p>
                    <p><strong>الأخطاء:</strong> ${review.mistakes}</p>
                    <p><strong>خطة التحسين:</strong> ${review.improvements}</p>
                </div>
                <button class="btn btn-small btn-danger" onclick="app.deleteReview(${review.id})">
                    حذف
                </button>
            </div>
        `).join('');
    }

    deleteReview(id) {
        if (confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
            this.reviews = this.reviews.filter(review => review.id !== id);
            this.saveReviews();
            this.renderReviews();
        }
    }

    // Analysis
    setupAnalysis() {
        this.renderBestAssets();
        this.renderBestTimes();
        this.renderErrorAnalysis();
    }

    renderBestAssets() {
        const container = document.getElementById('best-assets');
        const assetPerformance = {};

        this.trades.forEach(trade => {
            if (!assetPerformance[trade.asset]) {
                assetPerformance[trade.asset] = { profit: 0, trades: 0 };
            }
            assetPerformance[trade.asset].profit += trade.result;
            assetPerformance[trade.asset].trades += 1;
        });

        const sortedAssets = Object.entries(assetPerformance)
            .sort(([,a], [,b]) => b.profit - a.profit)
            .slice(0, 5);

        if (sortedAssets.length === 0) {
            container.innerHTML = '<p class="no-data">لا توجد بيانات كافية</p>';
            return;
        }

        container.innerHTML = sortedAssets.map(([asset, data]) => `
            <div class="analysis-item">
                <strong>${asset}</strong>: $${data.profit.toFixed(2)} (${data.trades} صفقات)
            </div>
        `).join('');
    }

    renderBestTimes() {
        const container = document.getElementById('best-times');
        const timePerformance = {};

        this.trades.forEach(trade => {
            const hour = parseInt(trade.entryTime.split(':')[0]);
            if (!timePerformance[hour]) {
                timePerformance[hour] = { profit: 0, trades: 0 };
            }
            timePerformance[hour].profit += trade.result;
            timePerformance[hour].trades += 1;
        });

        const sortedTimes = Object.entries(timePerformance)
            .sort(([,a], [,b]) => b.profit - a.profit)
            .slice(0, 5);

        if (sortedTimes.length === 0) {
            container.innerHTML = '<p class="no-data">لا توجد بيانات كافية</p>';
            return;
        }

        container.innerHTML = sortedTimes.map(([hour, data]) => `
            <div class="analysis-item">
                <strong>الساعة ${hour}:00</strong>: $${data.profit.toFixed(2)} (${data.trades} صفقات)
            </div>
        `).join('');
    }

    renderErrorAnalysis() {
        const container = document.getElementById('error-analysis');
        const losingTrades = this.trades.filter(trade => trade.result < 0);
        const totalLosses = losingTrades.length;

        if (totalLosses === 0) {
            container.innerHTML = '<p class="no-data">لا توجد صفقات خاسرة للتحليل</p>';
            return;
        }

        const avgLoss = losingTrades.reduce((sum, trade) => sum + trade.result, 0) / totalLosses;
        const worstAsset = this.getWorstPerformingAsset();

        container.innerHTML = `
            <div class="analysis-item">
                <strong>عدد الصفقات الخاسرة:</strong> ${totalLosses}
            </div>
            <div class="analysis-item">
                <strong>متوسط الخسارة:</strong> $${avgLoss.toFixed(2)}
            </div>
            <div class="analysis-item">
                <strong>أسوأ أصل أداءً:</strong> ${worstAsset}
            </div>
        `;
    }

    getWorstPerformingAsset() {
        const assetPerformance = {};
        this.trades.forEach(trade => {
            if (!assetPerformance[trade.asset]) {
                assetPerformance[trade.asset] = 0;
            }
            assetPerformance[trade.asset] += trade.result;
        });

        const worstAsset = Object.entries(assetPerformance)
            .sort(([,a], [,b]) => a - b)[0];

        return worstAsset ? worstAsset[0] : 'لا توجد بيانات';
    }

    // Charts
    setupCharts() {
        this.profitChart = null;
        this.weeklyChart = null;
        this.performanceChart = null;
        this.timeExitChart = null;
        this.updateCharts();
    }

    updateCharts() {
        this.updateProfitChart();
        this.updateWeeklyChart();
        this.updatePerformanceChart();
        this.updateTimeExitChart();
    }

    updateProfitChart() {
        const ctx = document.getElementById('profitChart');
        if (!ctx) return;

        if (this.profitChart) {
            this.profitChart.destroy();
        }

        const winningTrades = this.trades.filter(trade => trade.result > 0).length;
        const losingTrades = this.trades.filter(trade => trade.result <= 0).length;

        this.profitChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['صفقات رابحة', 'صفقات خاسرة'],
                datasets: [{
                    data: [winningTrades, losingTrades],
                    backgroundColor: ['#27ae60', '#e74c3c'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        if (this.weeklyChart) {
            this.weeklyChart.destroy();
        }

        // Group trades by week
        const weeklyData = this.getWeeklyData();

        this.weeklyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.labels,
                datasets: [{
                    label: 'الأرباح الأسبوعية',
                    data: weeklyData.data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updatePerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        if (this.performanceChart) {
            this.performanceChart.destroy();
        }

        const monthlyData = this.getMonthlyData();

        this.performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'الأداء الشهري',
                    data: monthlyData.data,
                    backgroundColor: monthlyData.data.map(value => 
                        value >= 0 ? '#27ae60' : '#e74c3c'
                    )
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    getWeeklyData() {
        const weeks = {};
        this.trades.forEach(trade => {
            const date = new Date(trade.date);
            const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
            const weekKey = weekStart.toISOString().split('T')[0];
            
            if (!weeks[weekKey]) {
                weeks[weekKey] = 0;
            }
            weeks[weekKey] += trade.result;
        });

        const sortedWeeks = Object.entries(weeks).sort();
        return {
            labels: sortedWeeks.map(([week]) => new Date(week).toLocaleDateString('ar-SA')),
            data: sortedWeeks.map(([, profit]) => profit)
        };
    }

    getMonthlyData() {
        const months = {};
        this.trades.forEach(trade => {
            const date = new Date(trade.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!months[monthKey]) {
                months[monthKey] = 0;
            }
            months[monthKey] += trade.result;
        });

        const sortedMonths = Object.entries(months).sort();
        return {
            labels: sortedMonths.map(([month]) => {
                const [year, monthNum] = month.split('-');
                return `${monthNum}/${year}`;
            }),
            data: sortedMonths.map(([, profit]) => profit)
        };
    }

    updateTimeExitChart() {
        const ctx = document.getElementById('timeExitChart');
        if (!ctx) return;

        if (this.timeExitChart) {
            this.timeExitChart.destroy();
        }

        const timeExitData = this.getTimeExitData();

        this.timeExitChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: timeExitData.datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: 0,
                        max: 23,
                        title: {
                            display: true,
                            text: this.currentLanguage === 'ar' ? 'ساعات اليوم' : 'Hours of Day'
                        },
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return value + ':00';
                            }
                        }
                    },
                    y: {
                        type: 'category',
                        labels: ['SL', 'TP', 'PK', 'BE', 'Manual', 'Other'],
                        title: {
                            display: true,
                            text: this.currentLanguage === 'ar' ? 'سبب الخروج' : 'Exit Reason'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const hour = context[0].parsed.x;
                                const reason = context[0].parsed.y;
                                return `الساعة ${hour}:00 - ${reason}`;
                            },
                            label: function(context) {
                                return `عدد الصفقات: ${context.dataset.data.filter(point => 
                                    point.x === context.parsed.x && 
                                    context.dataset.label === context.dataset.label
                                ).length}`;
                            }
                        }
                    }
                }
            }
        });
    }

    getTimeExitData() {
        const exitReasons = ['SL', 'TP', 'PK', 'BE', 'manual', 'other'];
        const colors = {
            'SL': '#e74c3c',      // أحمر - وقف الخسارة
            'TP': '#27ae60',      // أخضر - جني الأرباح
            'PK': '#f39c12',      // برتقالي - إغلاق جزئي
            'BE': '#3498db',      // أزرق - بدون خسارة أو ربح
            'manual': '#9b59b6',  // بنفسجي - إغلاق يدوي
            'other': '#95a5a6'    // رمادي - أخرى
        };

        const datasets = exitReasons.map(reason => {
            const data = this.trades
                .filter(trade => trade.exitReason === reason)
                .map(trade => {
                    const hour = trade.entryTime ? parseInt(trade.entryTime.split(':')[0]) : 0;
                    return {
                        x: hour,
                        y: this.getExitReasonIndex(reason)
                    };
                });

            return {
                label: this.getExitReasonText(reason),
                data: data,
                backgroundColor: colors[reason],
                borderColor: colors[reason],
                borderWidth: 1,
                pointRadius: 6,
                pointHoverRadius: 8
            };
        });

        return { datasets };
    }

    getExitReasonIndex(reason) {
        const reasonMap = {
            'SL': 0,
            'TP': 1,
            'PK': 2,
            'BE': 3,
            'manual': 4,
            'other': 5
        };
        return reasonMap[reason] || 5;
    }

    // Notification System
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('notification-fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 4000);
    }

    // Local Storage
    saveTrades() {
        localStorage.setItem(`trades_${this.currentUserId}`, JSON.stringify(this.trades));
    }

    saveNotes() {
        localStorage.setItem(`notes_${this.currentUserId}`, JSON.stringify(this.notes));
    }

    saveReviews() {
        localStorage.setItem(`reviews_${this.currentUserId}`, JSON.stringify(this.reviews));
    }
}

// Initialize the application
const app = new TradingJournal();

// Add some sample data for demonstration
if (app.trades.length === 0) {
    const sampleTrades = [
        {
            id: 1,
            date: '2024-01-15',
            asset: 'EUR/USD',
            type: 'buy',
            lotSize: 0.1,
            entryTime: '09:30',
            exitTime: '11:45',
            entryPrice: 1.0850,
            exitPrice: 1.0875,
            exitReason: 'TP',
            entryReason: 'اختراق مستوى المقاومة',
            comment: 'صفقة ناجحة حسب الخطة',
            result: 0.0025 * 0.1,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            date: '2024-01-16',
            asset: 'الذهب',
            type: 'sell',
            lotSize: 0.05,
            entryTime: '14:20',
            exitTime: '16:30',
            entryPrice: 2050.00,
            exitPrice: 2045.00,
            exitReason: 'TP',
            entryReason: 'إشارة فنية قوية',
            comment: 'وصل إلى الهدف المحدد',
            result: (2050.00 - 2045.00) * 0.05,
            createdAt: new Date().toISOString()
        }
    ];
    
    // Uncomment the next two lines to add sample data
    // app.trades = sampleTrades;
    // app.saveTrades();
}
