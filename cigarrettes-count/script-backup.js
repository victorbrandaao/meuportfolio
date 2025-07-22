class CigaretteTracker {
  constructor() {
    this.currentUser = "victor";
    this.data = {
      victor: {
        startDate: new Date().toISOString().split("T")[0],
        currentStock: 0,
        totalPacks: 0,
        totalSpent: 0,
        totalSmoked: 0,
        todaySmoked: 0,
        dailyLog: {},
        transactions: [],
        goals: {
          dailyLimit: 10,
          weeklyLimit: 50,
          monthlyBudget: 200,
        },
      },
      kalyne: {
        startDate: new Date().toISOString().split("T")[0],
        currentStock: 0,
        totalPacks: 0,
        totalSpent: 0,
        totalSmoked: 0,
        todaySmoked: 0,
        dailyLog: {},
        transactions: [],
        goals: {
          dailyLimit: 8,
          weeklyLimit: 40,
          monthlyBudget: 150,
        },
      },
      settings: {
        pricePerPack: 14.0,
        cigarettesPerPack: 20,
        costPerCigarette: 0.7,
        enableNotifications: true,
        enableHapticFeedback: true,
        theme: "dark",
      },
      lastUpdated: new Date().toISOString(),
    };

    this.chart = null;
    this.pendingConfirmAction = null;
    this.lastSmokeTime = null;

    this.init();
  }

  async init() {
    console.log("🚀 Iniciando CigarroTrack...");
    try {
      await this.showLoading();
      console.log("📊 Carregando dados...");
      this.loadData();
      console.log("🎯 Configurando eventos...");
      this.setupEventListeners();
      console.log("👆 Configurando gestos...");
      this.setupGestures();
      console.log("🔄 Atualizando displays...");
      this.updateAllDisplays();
      console.log("📈 Inicializando gráfico...");
      this.initChart();
      console.log("📱 Configurando PWA...");
      this.setupPWA();
      console.log("📅 Atualizando data...");
      this.updateTodayDate();
      console.log("✅ CigarroTrack iniciado com sucesso!");
      this.hideLoading();
    } catch (error) {
      console.error("❌ Erro na inicialização:", error);
      // Em caso de erro, ainda assim esconde o loading
      this.hideLoading();
    }
  }

  showLoading() {
    return new Promise((resolve) => {
      console.log("💫 Mostrando tela de loading...");
      setTimeout(resolve, 500); // Reduzido de 1000 para 500ms
    });
  }

  hideLoading() {
    try {
      const loadingScreen = document.getElementById("loadingScreen");
      if (loadingScreen) {
        console.log("🚫 Escondendo tela de loading...");
        loadingScreen.classList.add("hidden");
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      } else {
        console.log("⚠️ Loading screen não encontrada");
      }
    } catch (error) {
      console.error("❌ Erro ao esconder loading:", error);
    }
  }

  updateTodayDate() {
    const todayElement = document.getElementById("todayDate");
    if (todayElement) {
      const today = new Date();
      const options = { weekday: "short", day: "numeric", month: "short" };
      todayElement.textContent = today.toLocaleDateString("pt-BR", options);
    }
  }

  loadData() {
    const savedData = localStorage.getItem("cigaretteTrackerData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        this.data = { ...this.data, ...parsed };
      } catch (e) {
        console.error("Error loading data:", e);
      }
    }

    // Initialize today's data
    const today = this.getToday();
    ["victor", "kalyne"].forEach((user) => {
      if (!this.data[user].dailyLog[today]) {
        this.data[user].dailyLog[today] = 0;
      }
      this.data[user].todaySmoked = this.data[user].dailyLog[today] || 0;
    });

    this.calculateCostPerCigarette();
  }

  calculateCostPerCigarette() {
    this.data.settings.costPerCigarette =
      this.data.settings.pricePerPack / this.data.settings.cigarettesPerPack;
  }

  saveData() {
    this.data.lastUpdated = new Date().toISOString();
    localStorage.setItem("cigaretteTrackerData", JSON.stringify(this.data));
    this.showToast("Dados salvos automaticamente", "success");
  }

  getToday() {
    return new Date().toISOString().split("T")[0];
  }

  getDaysSinceStart(user) {
    const start = new Date(this.data[user].startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  setupEventListeners() {
    try {
      // User switching
      document.querySelectorAll(".user-option").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const user = e.currentTarget.dataset.user;
          this.switchUser(user);
        });
      });

      // Header actions
      const addCigarettesBtn = document.getElementById("addCigarettesBtn");
      const settingsBtn = document.getElementById("settingsBtn");
      const quickAddStock = document.getElementById("quickAddStock");

      if (addCigarettesBtn) {
        addCigarettesBtn.addEventListener("click", () =>
          this.openAddCigarettesModal()
        );
      }

      if (settingsBtn) {
        settingsBtn.addEventListener("click", () => this.openSettingsModal());
      }

      if (quickAddStock) {
        quickAddStock.addEventListener("click", () =>
          this.openAddCigarettesModal()
        );
      }

      // Action buttons
      const buyPackBtn = document.getElementById("buyPackBtn");
      const smokeBtn = document.getElementById("smokeBtn");
      const quickSmokeBtn = document.getElementById("quickSmokeBtn");

      if (buyPackBtn) {
        buyPackBtn.addEventListener("click", () => this.buyPack());
      }

      if (smokeBtn) {
        smokeBtn.addEventListener("click", () => this.smokeCigarette());
      }

      if (quickSmokeBtn) {
        quickSmokeBtn.addEventListener("click", () => this.smokeCigarette());
      }

      // Footer actions
      const historyBtn = document.getElementById("historyBtn");
      const resetBtn = document.getElementById("resetBtn");
      const exportBtn = document.getElementById("exportBtn");

      if (historyBtn) {
        historyBtn.addEventListener("click", () => this.openHistory());
      }

      if (resetBtn) {
        resetBtn.addEventListener("click", () => this.showResetConfirmation());
      }

      if (exportBtn) {
        exportBtn.addEventListener("click", () => this.exportData());
      }

      // Modal interactions
      this.setupModalEvents();
    } catch (error) {
      console.error("Erro ao configurar event listeners:", error);
    }
  }

  setupModalEvents() {
    // Add cigarettes modal
    const decreaseCount = document.getElementById("decreaseCount");
    const increaseCount = document.getElementById("increaseCount");
    const confirmAddCigarettes = document.getElementById(
      "confirmAddCigarettes"
    );

    if (decreaseCount) {
      decreaseCount.addEventListener("click", () => {
        const input = document.getElementById("cigaretteCount");
        if (input.value > 1) input.value = parseInt(input.value) - 1;
        this.updateCigaretteCost();
      });
    }

    if (increaseCount) {
      increaseCount.addEventListener("click", () => {
        const input = document.getElementById("cigaretteCount");
        input.value = parseInt(input.value) + 1;
        this.updateCigaretteCost();
      });
    }

    if (confirmAddCigarettes) {
      confirmAddCigarettes.addEventListener("click", () =>
        this.addCigarettes()
      );
    }

    // Settings modal
    const saveSettings = document.getElementById("saveSettings");
    if (saveSettings) {
      saveSettings.addEventListener("click", () => this.saveSettings());
    }

    // Close buttons
    document.querySelectorAll(".close-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.dataset.modal;
        if (modal) this.closeModal(modal);
      });
    });

    // Cancel buttons
    document.querySelectorAll(".modal-btn.cancel").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.dataset.modal;
        if (modal) this.closeModal(modal);
      });
    });

    // Confirmation modal
    const confirmYes = document.getElementById("confirmYes");
    const confirmCancel = document.getElementById("confirmCancel");

    if (confirmYes) {
      confirmYes.addEventListener("click", () => {
        if (this.pendingConfirmAction) {
          this.pendingConfirmAction();
          this.pendingConfirmAction = null;
        }
        this.closeModal("confirmModal");
      });
    }

    if (confirmCancel) {
      confirmCancel.addEventListener("click", () => {
        this.pendingConfirmAction = null;
        this.closeModal("confirmModal");
      });
    }

    // Close modals on outside click
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  setupGestures() {
    if (typeof Hammer !== "undefined") {
      const dashboard = document.querySelector(".dashboard");
      const hammer = new Hammer(dashboard);

      hammer.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });
      hammer.on("swipeleft", () => {
        if (this.currentUser === "victor") this.switchUser("kalyne");
      });
      hammer.on("swiperight", () => {
        if (this.currentUser === "kalyne") this.switchUser("victor");
      });
    }
  }

  switchUser(user) {
    this.currentUser = user;

    // Update UI
    document.querySelectorAll(".user-option").forEach((btn) => {
      btn.classList.remove("active");
    });

    const activeBtn = document.querySelector(`[data-user="${user}"]`);
    if (activeBtn) {
      activeBtn.classList.add("active");
    }

    this.updateAllDisplays();
    this.showToast(
      `Alterado para ${user === "victor" ? "Victor" : "Kalyne"}`,
      "success"
    );
  }

  openAddCigarettesModal() {
    document.getElementById("cigaretteCount").value =
      this.data.settings.cigarettesPerPack;
    this.updateCigaretteCost();
    this.openModal("addCigarettesModal");
  }

  updateCigaretteCost() {
    const count = document.getElementById("cigaretteCount").value;
    const costPerCig = this.data.settings.costPerCigarette;
    const totalCost = (count * costPerCig).toFixed(2);
    document.getElementById("cigaretteCost").value = totalCost;
  }

  addCigarettes() {
    const count = parseInt(document.getElementById("cigaretteCount").value);
    const cost = parseFloat(document.getElementById("cigaretteCost").value);

    if (count > 0 && cost >= 0) {
      const userData = this.data[this.currentUser];
      userData.currentStock += count;
      userData.totalSpent += cost;

      // Add transaction record
      userData.transactions.push({
        type: "add",
        amount: count,
        cost: cost,
        date: new Date().toISOString(),
        note: `Adicionados ${count} cigarros`,
      });

      this.saveData();
      this.updateAllDisplays();
      this.closeModal("addCigarettesModal");
      this.showToast(
        `✅ Adicionados ${count} cigarros por R$ ${cost.toFixed(2)}`,
        "success"
      );
    }
  }

  buyPack() {
    const settings = this.data.settings;
    const userData = this.data[this.currentUser];

    userData.currentStock += settings.cigarettesPerPack;
    userData.totalPacks++;
    userData.totalSpent += settings.pricePerPack;

    // Add transaction
    userData.transactions.push({
      type: "buy",
      amount: settings.cigarettesPerPack,
      cost: settings.pricePerPack,
      date: new Date().toISOString(),
      note: `Comprou carteira de ${settings.cigarettesPerPack} cigarros`,
    });

    this.saveData();
    this.updateAllDisplays();
    this.showToast(
      `📦 Carteira comprada! +${settings.cigarettesPerPack} cigarros`,
      "success"
    );
  }

  smokeCigarette() {
    const userData = this.data[this.currentUser];

    if (userData.currentStock <= 0) {
      this.showToast("⚠️ Sem cigarros! Adicione cigarros primeiro", "warning");
      return;
    }

    // Check if trying to smoke too frequently (less than 10 minutes)
    const now = new Date();
    if (this.lastSmokeTime && now - this.lastSmokeTime < 10 * 60 * 1000) {
      const minutesLeft = Math.ceil(
        (10 * 60 * 1000 - (now - this.lastSmokeTime)) / 60000
      );
      this.showToast(
        `⏰ Aguarde ${minutesLeft} min para fumar novamente`,
        "warning"
      );
      return;
    }

    const today = this.getToday();

    // Check daily limit
    const currentDailyCount = userData.dailyLog[today] || 0;
    if (currentDailyCount >= userData.goals.dailyLimit) {
      this.pendingConfirmAction = () => this.forceSmokeCigarette();
      document.getElementById(
        "confirmMessage"
      ).textContent = `⚠️ Você já fumou ${currentDailyCount} cigarros hoje (limite: ${userData.goals.dailyLimit}). Deseja continuar mesmo assim?`;
      this.openModal("confirmModal");
      return;
    }

    this.forceSmokeCigarette();
  }

  forceSmokeCigarette() {
    const userData = this.data[this.currentUser];
    const today = this.getToday();

    // Update data
    userData.currentStock--;
    userData.totalSmoked++;
    this.lastSmokeTime = new Date();

    if (!userData.dailyLog[today]) {
      userData.dailyLog[today] = 0;
    }
    userData.dailyLog[today]++;
    userData.todaySmoked = userData.dailyLog[today];

    // Add transaction
    userData.transactions.push({
      type: "smoke",
      amount: 1,
      cost: this.data.settings.costPerCigarette,
      date: new Date().toISOString(),
      note: "Fumou 1 cigarro",
    });

    // Add haptic feedback
    this.addHapticFeedback();

    // Check for warnings
    this.checkLimitsAndWarnings();

    this.saveData();
    this.updateAllDisplays();
    this.showToast(
      `🚬 Fumou 1 cigarro (-R$ ${this.data.settings.costPerCigarette.toFixed(
        2
      )})`,
      "warning"
    );
  }

  checkLimitsAndWarnings() {
    const userData = this.data[this.currentUser];
    const today = this.getToday();
    const todayCount = userData.dailyLog[today] || 0;

    // Daily limit warnings
    if (todayCount === Math.floor(userData.goals.dailyLimit * 0.8)) {
      this.showToast("⚠️ Atenção: 80% do limite diário atingido!", "warning");
    } else if (todayCount === userData.goals.dailyLimit) {
      this.showToast("🔴 Limite diário atingido!", "error");
    }

    // Low stock warning
    if (userData.currentStock <= 5 && userData.currentStock > 0) {
      this.showToast(
        `📦 Estoque baixo: ${userData.currentStock} cigarros restantes`,
        "warning"
      );
    }

    // Weekly check
    const weeklyCount = this.getWeeklyCount();
    if (weeklyCount >= userData.goals.weeklyLimit) {
      this.showToast("📊 Limite semanal atingido!", "error");
    }
  }

  getWeeklyCount() {
    const userData = this.data[this.currentUser];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    let weeklyTotal = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      weeklyTotal += userData.dailyLog[dateStr] || 0;
    }
    return weeklyTotal;
  }

  addHapticFeedback() {
    if (this.data.settings.enableHapticFeedback && "vibrate" in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  }

  updateAllDisplays() {
    this.updateCurrentUser();
    this.updateUserStatuses();
    this.updateChart();
  }

  updateCurrentUser() {
    const userData = this.data[this.currentUser];
    const days = this.getDaysSinceStart(this.currentUser);

    // Current stock with color coding and indicators
    const currentStockElement = document.getElementById("currentStock");
    const stockIndicator = document.getElementById("stockIndicator");
    const stockProgress = document.getElementById("stockProgress");

    if (currentStockElement) {
      currentStockElement.textContent = userData.currentStock;

      // Color code and indicator based on stock level
      if (userData.currentStock <= 3) {
        currentStockElement.style.color = "var(--danger)";
        stockIndicator.className = "stock-indicator critical";
      } else if (userData.currentStock <= 8) {
        currentStockElement.style.color = "var(--warning)";
        stockIndicator.className = "stock-indicator low";
      } else {
        currentStockElement.style.color = "var(--secondary)";
        stockIndicator.className = "stock-indicator";
      }

      // Update stock progress bar (assuming max of 40 as full stock)
      const stockPercentage = Math.min((userData.currentStock / 40) * 100, 100);
      if (stockProgress) {
        stockProgress.style.width = `${stockPercentage}%`;
      }
    }

    // Stock value
    const stockValueElement = document.getElementById("stockValue");
    if (stockValueElement) {
      const value = userData.currentStock * this.data.settings.costPerCigarette;
      stockValueElement.textContent = `R$ ${value.toFixed(2)}`;
    }

    // Today's stats with progress indicators
    const todaySmokedElement = document.getElementById("todaySmoked");
    if (todaySmokedElement) {
      const dailyLimit = userData.goals.dailyLimit;
      const percentage = Math.min(
        (userData.todaySmoked / dailyLimit) * 100,
        100
      );
      todaySmokedElement.textContent = `${userData.todaySmoked}/${dailyLimit}`;

      // Color code based on daily limit
      if (percentage >= 100) {
        todaySmokedElement.style.color = "var(--danger)";
      } else if (percentage >= 80) {
        todaySmokedElement.style.color = "var(--warning)";
      } else {
        todaySmokedElement.style.color = "var(--text-primary)";
      }
    }

    const todayWastedElement = document.getElementById("todayWasted");
    if (todayWastedElement) {
      const wasted = userData.todaySmoked * this.data.settings.costPerCigarette;
      todayWastedElement.textContent = `R$ ${wasted.toFixed(2)}`;
    }

    // Statistics
    const totalSpentElement = document.getElementById("totalSpent");
    if (totalSpentElement) {
      totalSpentElement.textContent = `R$ ${userData.totalSpent.toFixed(2)}`;
    }

    const totalPacksElement = document.getElementById("totalPacks");
    if (totalPacksElement) {
      totalPacksElement.textContent = userData.totalPacks;
    }

    const avgPerDayElement = document.getElementById("avgPerDay");
    if (avgPerDayElement) {
      const avg = days > 0 ? (userData.totalSmoked / days).toFixed(1) : "0";
      avgPerDayElement.textContent = avg;
    }

    const totalDaysElement = document.getElementById("totalDays");
    if (totalDaysElement) {
      totalDaysElement.textContent = days;
    }

    // Update action button states and prices
    this.updateActionButtonStates();
  }

  updateActionButtonStates() {
    const userData = this.data[this.currentUser];
    const smokeBtn = document.getElementById("smokeBtn");
    const quickSmokeBtn = document.getElementById("quickSmokeBtn");

    // Disable smoke buttons if no stock
    const isDisabled = userData.currentStock <= 0;

    if (smokeBtn) {
      smokeBtn.classList.toggle("disabled", isDisabled);
      const subtitle = smokeBtn.querySelector(".action-subtitle");
      if (subtitle) {
        if (isDisabled) {
          subtitle.textContent = "Sem cigarros disponíveis";
          subtitle.style.color = "var(--danger)";
        } else {
          subtitle.textContent = `-1 cigarro • R$ ${this.data.settings.costPerCigarette.toFixed(
            2
          )}`;
          subtitle.style.color = "";
        }
      }
    }

    if (quickSmokeBtn) {
      quickSmokeBtn.style.opacity = isDisabled ? "0.5" : "1";
      quickSmokeBtn.style.pointerEvents = isDisabled ? "none" : "auto";
    }

    // Update buy button price
    const buyBtn = document.getElementById("buyPackBtn");
    if (buyBtn) {
      const subtitle = buyBtn.querySelector(".action-subtitle");
      if (subtitle) {
        subtitle.textContent = `+${
          this.data.settings.cigarettesPerPack
        } cigarros • R$ ${this.data.settings.pricePerPack.toFixed(2)}`;
      }
    }
  }

  updateUserStatuses() {
    const victorStatus = document.getElementById("victorStatus");
    const kalyneStatus = document.getElementById("kalyneStatus");

    if (victorStatus) {
      victorStatus.textContent = `${this.data.victor.todaySmoked} hoje`;
    }

    if (kalyneStatus) {
      kalyneStatus.textContent = `${this.data.kalyne.todaySmoked} hoje`;
    }
  }

  initChart() {
    try {
      const ctx = document.getElementById("weeklyChart");
      if (!ctx) {
        console.log("Chart element not found, skipping chart initialization");
        return;
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
          datasets: [
            {
              label: this.currentUser === "victor" ? "Victor" : "Kalyne",
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor:
                this.currentUser === "victor" ? "#ff6b35" : "#00d4aa",
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: "#666666",
              },
              grid: { color: "#333333" },
            },
            x: {
              ticks: { color: "#666666" },
              grid: { display: false },
            },
          },
        },
      });

      this.updateChart();
    } catch (error) {
      console.error("Erro ao inicializar gráfico:", error);
    }
  }

  updateChart() {
    if (!this.chart) return;

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      weekData.push(this.data[this.currentUser].dailyLog[dateStr] || 0);
    }

    this.chart.data.datasets[0].data = weekData;
    this.chart.data.datasets[0].label =
      this.currentUser === "victor" ? "Victor" : "Kalyne";
    this.chart.data.datasets[0].backgroundColor =
      this.currentUser === "victor" ? "#ff6b35" : "#00d4aa";
    this.chart.update("none");
  }

  openSettingsModal() {
    document.getElementById("packPrice").value =
      this.data.settings.pricePerPack;
    document.getElementById("packSize").value =
      this.data.settings.cigarettesPerPack;
    this.openModal("settingsModal");
  }

  saveSettings() {
    const packPrice = parseFloat(document.getElementById("packPrice").value);
    const packSize = parseInt(document.getElementById("packSize").value);

    if (packPrice > 0 && packSize > 0) {
      this.data.settings.pricePerPack = packPrice;
      this.data.settings.cigarettesPerPack = packSize;
      this.calculateCostPerCigarette();

      this.saveData();
      this.updateAllDisplays();
      this.closeModal("settingsModal");
      this.showToast("⚙️ Configurações salvas!", "success");
    }
  }

  openHistory() {
    const content = document.getElementById("historyContent");
    if (!content) return;

    content.innerHTML = "";

    const userData = this.data[this.currentUser];
    const transactions = [...userData.transactions].reverse();

    if (transactions.length === 0) {
      content.innerHTML =
        '<p style="text-align: center; color: #666;">Nenhum histórico encontrado.</p>';
    } else {
      transactions.forEach((transaction) => {
        const div = document.createElement("div");
        div.style.cssText = `
          background: var(--bg-card, #2a2a2a);
          border: 1px solid var(--border-color, #444);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        `;

        const date = new Date(transaction.date);
        const typeIcon =
          {
            add: "➕",
            buy: "🛒",
            smoke: "🚬",
          }[transaction.type] || "📝";

        div.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 18px;">${typeIcon}</span>
              <span style="margin-left: 8px; font-weight: 500;">${
                transaction.note
              }</span>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 600; color: ${
                transaction.type === "smoke" ? "#ff6b35" : "#00d4aa"
              };">
                ${
                  transaction.type === "smoke" ? "-" : "+"
                }R$ ${transaction.cost.toFixed(2)}
              </div>
              <div style="font-size: 12px; color: #666;">
                ${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString(
          "pt-BR",
          { hour: "2-digit", minute: "2-digit" }
        )}
              </div>
            </div>
          </div>
        `;

        content.appendChild(div);
      });
    }

    this.openModal("historyModal");
  }

  showResetConfirmation() {
    document.getElementById("confirmMessage").textContent =
      "Tem certeza que deseja resetar TODOS os dados? Esta ação não pode ser desfeita.";

    this.pendingConfirmAction = () => this.resetAllData();
    this.openModal("confirmModal");
  }

  resetAllData() {
    const today = new Date().toISOString().split("T")[0];

    ["victor", "kalyne"].forEach((user) => {
      this.data[user] = {
        startDate: today,
        currentStock: 0,
        totalPacks: 0,
        totalSpent: 0,
        totalSmoked: 0,
        todaySmoked: 0,
        dailyLog: {},
        transactions: [],
        goals: this.data[user].goals, // Preserve goals
      };
    });

    this.saveData();
    this.updateAllDisplays();
    this.showToast("🔄 Todos os dados foram resetados", "success");
  }

  // New method for advanced statistics
  getAdvancedStats() {
    const userData = this.data[this.currentUser];
    const days = this.getDaysSinceStart(this.currentUser);
    const weeklyCount = this.getWeeklyCount();

    // Calculate monthly spending
    const thisMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    const monthlySpent = userData.transactions
      .filter(
        (t) =>
          t.date.startsWith(thisMonth) && (t.type === "buy" || t.type === "add")
      )
      .reduce((sum, t) => sum + t.cost, 0);

    // Calculate efficiency (how much of purchased cigarettes were actually smoked)
    const totalPurchased =
      userData.totalPacks * this.data.settings.cigarettesPerPack;
    const efficiency =
      totalPurchased > 0 ? (userData.totalSmoked / totalPurchased) * 100 : 0;

    // Calculate average time between cigarettes today
    const todayTransactions = userData.transactions.filter(
      (t) => t.type === "smoke" && t.date.startsWith(this.getToday())
    );

    let avgTimeBetween = 0;
    if (todayTransactions.length > 1) {
      const times = todayTransactions.map((t) => new Date(t.date).getTime());
      const intervals = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      avgTimeBetween =
        intervals.reduce((a, b) => a + b, 0) / intervals.length / (1000 * 60); // minutes
    }

    return {
      days,
      weeklyCount,
      monthlySpent,
      efficiency: efficiency.toFixed(1),
      avgTimeBetween: Math.round(avgTimeBetween),
      dailyProgress: (
        (userData.todaySmoked / userData.goals.dailyLimit) *
        100
      ).toFixed(1),
      weeklyProgress: (
        (weeklyCount / userData.goals.weeklyLimit) *
        100
      ).toFixed(1),
      monthlyBudgetUsed: (
        (monthlySpent / userData.goals.monthlyBudget) *
        100
      ).toFixed(1),
    };
  }

  exportData() {
    const data = JSON.stringify(this.data, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `cigarrotrack-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();

    URL.revokeObjectURL(url);
    this.showToast("📤 Dados exportados!", "success");
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }
  }

  showToast(message, type = "success", duration = 3000) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    // Add icon based on type
    const icons = {
      success: "✅",
      warning: "⚠️",
      error: "❌",
      info: "ℹ️",
    };

    const icon = icons[type] || icons.info;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">${icon}</span>
        <div>${message}</div>
      </div>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.animation = "slideOutRight 0.3s ease forwards";
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, duration);

    // Add click to dismiss
    toast.addEventListener("click", () => {
      toast.style.animation = "slideOutRight 0.3s ease forwards";
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    });
  }

  setupPWA() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("sw.js")
        .then((registration) => {
          console.log("SW registered:", registration);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    }
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DOM carregado, criando CigaretteTracker...");
  try {
    window.tracker = new CigaretteTracker();
    console.log("✅ CigaretteTracker criado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar CigaretteTracker:", error);
  }
});

// Handle page visibility
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && window.tracker) {
    window.tracker.updateAllDisplays();
  }
});
