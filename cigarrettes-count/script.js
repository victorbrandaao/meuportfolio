class CigarroTrack {
    constructor() {
        this.currentUser = 'victor';
        this.data = this.loadData();
        this.chart = null;
        this.pendingAction = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando CigarroTrack v2.0...');
        
        try {
            await this.showLoading();
            this.setupEventListeners();
            this.updateAllDisplays();
            this.initChart();
            this.setupPWA();
            console.log('✅ CigarroTrack iniciado com sucesso!');
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.showToast('Erro ao inicializar o app', 'error');
        } finally {
            this.hideLoading();
        }
    }

    loadData() {
        const defaultData = {
            victor: {
                startDate: new Date().toISOString().split('T')[0],
                currentStock: 0,
                totalSpent: 0,
                totalSmoked: 0,
                dailyLog: {},
                transactions: [],
                goals: {
                    dailyLimit: 10,
                    weeklyLimit: 50
                }
            },
            kalyne: {
                startDate: new Date().toISOString().split('T')[0],
                currentStock: 0,
                totalSpent: 0,
                totalSmoked: 0,
                dailyLog: {},
                transactions: [],
                goals: {
                    dailyLimit: 8,
                    weeklyLimit: 40
                }
            },
            settings: {
                pricePerPack: 14.00,
                cigarettesPerPack: 20,
                enableNotifications: true,
                lastUpdated: new Date().toISOString()
            }
        };

        const saved = localStorage.getItem('cigaretteTracker');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...defaultData, ...parsed };
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
                return defaultData;
            }
        }
        return defaultData;
    }

    saveData() {
        try {
            this.data.settings.lastUpdated = new Date().toISOString();
            localStorage.setItem('cigaretteTracker', JSON.stringify(this.data));
            console.log('💾 Dados salvos');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            this.showToast('Erro ao salvar dados', 'error');
        }
    }

    getToday() {
        return new Date().toISOString().split('T')[0];
    }

    getTodayCount(user = this.currentUser) {
        const today = this.getToday();
        return this.data[user].dailyLog[today] || 0;
    }

    getWeekCount(user = this.currentUser) {
        const today = new Date();
        let count = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            count += this.data[user].dailyLog[dateStr] || 0;
        }
        return count;
    }

    getMonthCount(user = this.currentUser) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        let count = 0;
        
        Object.entries(this.data[user].dailyLog).forEach(([date, cigarettes]) => {
            const logDate = new Date(date);
            if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
                count += cigarettes;
            }
        });
        return count;
    }

    getCostPerCigarette() {
        return this.data.settings.pricePerPack / this.data.settings.cigarettesPerPack;
    }

    getTodaySpent(user = this.currentUser) {
        return this.getTodayCount(user) * this.getCostPerCigarette();
    }

    setupEventListeners() {
        // User tabs
        document.querySelectorAll('.user-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const user = e.currentTarget.dataset.user;
                this.switchUser(user);
            });
        });

        // Action buttons
        document.getElementById('smokeBtn')?.addEventListener('click', () => this.smokeCigarette());
        document.getElementById('buyBtn')?.addEventListener('click', () => this.openBuyModal());

        // Settings
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettingsModal());

        // Bottom nav
        document.getElementById('historyBtn')?.addEventListener('click', () => this.showHistory());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.showResetConfirmation());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportData());

        // Modal events
        this.setupModalEvents();

        // Buy modal
        document.getElementById('confirmBuy')?.addEventListener('click', () => this.confirmBuy());
        document.getElementById('packCount')?.addEventListener('input', () => this.updateBuyTotal());
        document.getElementById('packPrice')?.addEventListener('input', () => this.updateBuyTotal());

        // Settings modal
        document.getElementById('saveSettings')?.addEventListener('click', () => this.saveSettings());

        // Confirmation modal
        document.getElementById('confirmYes')?.addEventListener('click', () => this.executeAction());
        document.getElementById('confirmCancel')?.addEventListener('click', () => this.closeModal('confirmModal'));
    }

    setupModalEvents() {
        // Close modals
        document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.dataset.modal || e.target.closest('.modal').id;
                this.closeModal(modal);
            });
        });

        // Close on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    switchUser(user) {
        this.currentUser = user;
        
        // Update active tab
        document.querySelectorAll('.user-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.user === user);
        });
        
        this.updateAllDisplays();
        this.updateChart();
        this.showToast(`Usuário alterado para ${user === 'victor' ? 'Victor' : 'Kalyne'}`, 'success');
    }

    updateAllDisplays() {
        this.updateTodayStats();
        this.updateQuickStats();
        this.updateUserCounts();
    }

    updateTodayStats() {
        const today = this.getTodayCount();
        const stock = this.data[this.currentUser].currentStock;
        const spent = this.getTodaySpent();

        document.getElementById('todayCount').textContent = today;
        document.getElementById('stockCount').textContent = stock;
        document.getElementById('spentToday').textContent = `R$ ${spent.toFixed(2)}`;
    }

    updateQuickStats() {
        const week = this.getWeekCount();
        const month = this.getMonthCount();
        const total = this.data[this.currentUser].totalSpent;

        document.getElementById('weekCount').textContent = week;
        document.getElementById('monthCount').textContent = month;
        document.getElementById('totalSpent').textContent = `R$ ${total.toFixed(2)}`;
    }

    updateUserCounts() {
        const victorCount = this.getTodayCount('victor');
        const kalyneCount = this.getTodayCount('kalyne');

        document.getElementById('victorCount').textContent = `${victorCount} hoje`;
        document.getElementById('kalyneCount').textContent = `${kalyneCount} hoje`;
    }

    smokeCigarette() {
        const userData = this.data[this.currentUser];
        
        if (userData.currentStock <= 0) {
            this.showToast('Estoque vazio! Compre mais cigarros primeiro.', 'error');
            return;
        }

        // Update data
        userData.currentStock--;
        userData.totalSmoked++;
        
        const today = this.getToday();
        userData.dailyLog[today] = (userData.dailyLog[today] || 0) + 1;
        
        const cost = this.getCostPerCigarette();
        userData.totalSpent += cost;

        // Add transaction
        userData.transactions.push({
            type: 'smoke',
            date: new Date().toISOString(),
            amount: 1,
            cost: cost
        });

        this.saveData();
        this.updateAllDisplays();
        this.updateChart();
        this.showToast('Cigarro registrado', 'warning');
    }

    openBuyModal() {
        document.getElementById('packCount').value = 1;
        document.getElementById('packPrice').value = this.data.settings.pricePerPack.toFixed(2);
        this.updateBuyTotal();
        this.openModal('buyModal');
    }

    updateBuyTotal() {
        const packs = parseInt(document.getElementById('packCount').value) || 0;
        const price = parseFloat(document.getElementById('packPrice').value) || 0;
        const total = packs * price;
        document.getElementById('buyTotal').textContent = total.toFixed(2);
    }

    confirmBuy() {
        const packs = parseInt(document.getElementById('packCount').value);
        const pricePerPack = parseFloat(document.getElementById('packPrice').value);
        
        if (packs <= 0 || pricePerPack <= 0) {
            this.showToast('Valores inválidos', 'error');
            return;
        }

        const totalCigarettes = packs * this.data.settings.cigarettesPerPack;
        const totalCost = packs * pricePerPack;
        const userData = this.data[this.currentUser];

        // Update data
        userData.currentStock += totalCigarettes;
        userData.totalSpent += totalCost;

        // Add transaction
        userData.transactions.push({
            type: 'buy',
            date: new Date().toISOString(),
            packs: packs,
            pricePerPack: pricePerPack,
            totalCost: totalCost,
            cigarettes: totalCigarettes
        });

        this.saveData();
        this.updateAllDisplays();
        this.closeModal('buyModal');
        this.showToast(`${totalCigarettes} cigarros adicionados ao estoque`, 'success');
    }

    openSettingsModal() {
        document.getElementById('defaultPrice').value = this.data.settings.pricePerPack.toFixed(2);
        document.getElementById('cigarettesPerPack').value = this.data.settings.cigarettesPerPack;
        document.getElementById('dailyGoal').value = this.data[this.currentUser].goals.dailyLimit;
        this.openModal('settingsModal');
    }

    saveSettings() {
        const price = parseFloat(document.getElementById('defaultPrice').value);
        const cigarettesPerPack = parseInt(document.getElementById('cigarettesPerPack').value);
        const dailyGoal = parseInt(document.getElementById('dailyGoal').value);

        if (price > 0) this.data.settings.pricePerPack = price;
        if (cigarettesPerPack > 0) this.data.settings.cigarettesPerPack = cigarettesPerPack;
        if (dailyGoal >= 0) this.data[this.currentUser].goals.dailyLimit = dailyGoal;

        this.saveData();
        this.updateAllDisplays();
        this.closeModal('settingsModal');
        this.showToast('Configurações salvas', 'success');
    }

    showResetConfirmation() {
        const userName = this.currentUser === 'victor' ? 'Victor' : 'Kalyne';
        document.getElementById('confirmMessage').textContent = 
            `Tem certeza que deseja resetar todos os dados de ${userName}? Esta ação não pode ser desfeita.`;
        
        this.pendingAction = () => this.resetUserData();
        this.openModal('confirmModal');
    }

    resetUserData() {
        const today = new Date().toISOString().split('T')[0];
        
        this.data[this.currentUser] = {
            startDate: today,
            currentStock: 0,
            totalSpent: 0,
            totalSmoked: 0,
            dailyLog: {},
            transactions: [],
            goals: {
                dailyLimit: this.currentUser === 'victor' ? 10 : 8,
                weeklyLimit: this.currentUser === 'victor' ? 50 : 40
            }
        };

        this.saveData();
        this.updateAllDisplays();
        this.updateChart();
        this.closeModal('confirmModal');
        
        const userName = this.currentUser === 'victor' ? 'Victor' : 'Kalyne';
        this.showToast(`Dados de ${userName} resetados`, 'success');
    }

    executeAction() {
        if (this.pendingAction) {
            this.pendingAction();
            this.pendingAction = null;
        }
    }

    showHistory() {
        const transactions = this.data[this.currentUser].transactions.slice(-20).reverse();
        let historyHtml = '<div style="max-height: 300px; overflow-y: auto;">';
        
        if (transactions.length === 0) {
            historyHtml += '<p style="text-align: center; color: var(--text-secondary);">Nenhuma transação encontrada</p>';
        } else {
            transactions.forEach(t => {
                const date = new Date(t.date).toLocaleDateString('pt-BR');
                const time = new Date(t.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                
                if (t.type === 'smoke') {
                    historyHtml += `
                        <div style="border-bottom: 1px solid var(--border-color); padding: 12px 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span style="color: var(--danger);">🚬 Fumou 1 cigarro</span>
                                    <div style="font-size: 12px; color: var(--text-secondary);">${date} às ${time}</div>
                                </div>
                                <span style="color: var(--danger);">-R$ ${t.cost.toFixed(2)}</span>
                            </div>
                        </div>
                    `;
                } else if (t.type === 'buy') {
                    historyHtml += `
                        <div style="border-bottom: 1px solid var(--border-color); padding: 12px 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span style="color: var(--success);">🛒 Comprou ${t.packs} maço(s)</span>
                                    <div style="font-size: 12px; color: var(--text-secondary);">${date} às ${time}</div>
                                </div>
                                <span style="color: var(--danger);">R$ ${t.totalCost.toFixed(2)}</span>
                            </div>
                        </div>
                    `;
                }
            });
        }
        
        historyHtml += '</div>';
        
        // Create temporary modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📊 Histórico - ${this.currentUser === 'victor' ? 'Victor' : 'Kalyne'}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    ${historyHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    exportData() {
        const userData = this.data[this.currentUser];
        const exportData = {
            user: this.currentUser,
            exportDate: new Date().toISOString(),
            data: userData,
            summary: {
                totalSmoked: userData.totalSmoked,
                totalSpent: userData.totalSpent,
                currentStock: userData.currentStock,
                todaySmoked: this.getTodayCount(),
                weekSmoked: this.getWeekCount(),
                monthSmoked: this.getMonthCount()
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cigarrotrack-${this.currentUser}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Dados exportados', 'success');
    }

    initChart() {
        const ctx = document.getElementById('weekChart');
        if (!ctx) return;

        try {
            if (this.chart) {
                this.chart.destroy();
            }

            const last7Days = [];
            const data = [];
            const today = new Date();

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                
                last7Days.push(dayName);
                data.push(this.data[this.currentUser].dailyLog[dateStr] || 0);
            }

            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: last7Days,
                    datasets: [{
                        label: 'Cigarros',
                        data: data,
                        backgroundColor: this.currentUser === 'victor' ? '#ef4444' : '#10b981',
                        borderRadius: 4,
                        borderSkipped: false,
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
                            ticks: {
                                stepSize: 1,
                                color: '#6b7280'
                            },
                            grid: { color: '#333333' }
                        },
                        x: {
                            ticks: { color: '#6b7280' },
                            grid: { display: false }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao criar gráfico:', error);
        }
    }

    updateChart() {
        if (!this.chart) return;

        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            data.push(this.data[this.currentUser].dailyLog[dateStr] || 0);
        }

        this.chart.data.datasets[0].data = data;
        this.chart.data.datasets[0].backgroundColor = this.currentUser === 'victor' ? '#ef4444' : '#10b981';
        this.chart.update();
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showToast(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toastContainer');
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, duration);
    }

    async showLoading() {
        return new Promise(resolve => setTimeout(resolve, 800));
    }

    hideLoading() {
        const loading = document.getElementById('loadingScreen');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    setupPWA() {
        // Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(() => console.log('SW registrado'))
                .catch(err => console.log('SW erro:', err));
        }

        // Install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            deferredPrompt = e;
            this.showToast('App pode ser instalado', 'success');
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.cigarroTrack = new CigarroTrack();
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.cigarroTrack) {
        window.cigarroTrack.updateAllDisplays();
    }
});
