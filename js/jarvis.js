/**
 * SIKAP Dashboard Controller & n8n Webhook Integration
 * Context: Kantor Wilayah Kementerian Imigrasi dan Pemasyarakatan Bangka Belitung
 * Handles Chat Input Prompt, fetch() to n8n Webhook, and Chart.js dynamic updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Color Palette - Official Government Imigrasi Theme (Navy, Soft Gold, Emerald, Teal)
  const COLORS = {
    navy: '#0f172a',
    blue: '#1e3a8a',
    blueBright: '#1d4ed8',
    gold: '#f59e0b',
    goldLight: '#fbbf24',
    goldSoft: '#fef3c7',
    emerald: '#10b981',
    teal: '#0d9488',
    slate: '#475569',
    gridLines: '#e2e8f0',
    textMuted: '#64748b'
  };

  const PRODUCTION_WEBHOOK_URL = 'https://janetcools.app.n8n.cloud/webhook/jarvis_query';

  // State Management
  let barChartInstance = null;
  let pieChartInstance = null;
  let n8nWebhookUrl = localStorage.getItem('jarvis_n8n_url') || PRODUCTION_WEBHOOK_URL;

  // Default Budget Data: DIPA T.A. 2026 Kanwil Kemenimipas Bangka Belitung
  let currentBudgetData = {
    labels: ['Seksi Lantaskim', 'Seksi Intalta', 'Seksi Inteldakim', 'Seksi Tikim', 'Subbagian TU'],
    pagu: [18500000000, 14200000000, 12800000000, 9500000000, 7000000000],
    realisasi: [15200000000, 11400000000, 9800000000, 7100000000, 5800000000]
  };

  // DOM Elements
  const promptForm = document.getElementById('jarvisPromptForm');
  const promptInput = document.getElementById('promptInput');
  const btnSubmitPrompt = document.getElementById('btnSubmitPrompt');
  const jarvisStatusHeader = document.getElementById('jarvisStatusHeader');
  const jarvisMessageText = document.getElementById('jarvisMessageText');

  // Stats Elements
  const statTotalPagu = document.getElementById('statTotalPagu');
  const statTotalRealisasi = document.getElementById('statTotalRealisasi');
  const statPctPenyerapan = document.getElementById('statPctPenyerapan');
  const statStatus = document.getElementById('statStatus');
  const statTimestamp = document.getElementById('statTimestamp');

  // Modal Elements
  const btnWebhookConfig = document.getElementById('btnWebhookConfig');
  const webhookModal = document.getElementById('webhookModal');
  const btnCloseWebhookModal = document.getElementById('btnCloseWebhookModal');
  const inputN8nWebhookUrl = document.getElementById('inputN8nWebhookUrl');
  const btnSaveWebhookUrl = document.getElementById('btnSaveWebhookUrl');
  const btnSimulateData = document.getElementById('btnSimulateData');
  const webhookStatusText = document.getElementById('webhookStatusText');

  // 1. Initialize Chart.js Graphs & UI
  initCharts();
  updateDashboardUI();
  updateWebhookStatusBadge();

  // 2. Setup Chart.js Instances
  function initCharts() {
    const barCtx = document.getElementById('barChartCanvas');
    const pieCtx = document.getElementById('pieChartCanvas');

    if (!barCtx || !pieCtx) return;

    if (barChartInstance) barChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();

    // BAR CHART: Pagu vs Realisasi per Seksi/Subbag
    barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: currentBudgetData.labels,
        datasets: [
          {
            label: 'Alokasi Pagu DIPA (Rp)',
            data: currentBudgetData.pagu,
            backgroundColor: 'rgba(30, 58, 138, 0.85)',
            borderColor: COLORS.blue,
            borderWidth: 1.5,
            borderRadius: 6,
          },
          {
            label: 'Realisasi Terserap (Rp)',
            data: currentBudgetData.realisasi,
            backgroundColor: 'rgba(245, 158, 11, 0.85)',
            borderColor: COLORS.gold,
            borderWidth: 1.5,
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#1e293b',
              font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#fbbf24',
            bodyColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: Rp ${ctx.raw.toLocaleString('id-ID')}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: COLORS.gridLines },
            ticks: { color: COLORS.slate, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
          },
          y: {
            grid: { color: COLORS.gridLines },
            ticks: {
              color: COLORS.slate,
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (val) => `Rp ${(val / 1000000000).toFixed(1)} M`
            }
          }
        }
      }
    });

    // PIE / DONUT CHART: Proporsi Realisasi per Seksi
    pieChartInstance = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: currentBudgetData.labels,
        datasets: [{
          data: currentBudgetData.realisasi,
          backgroundColor: [
            'rgba(30, 58, 138, 0.9)',
            'rgba(245, 158, 11, 0.9)',
            'rgba(16, 185, 129, 0.9)',
            'rgba(13, 148, 136, 0.9)',
            'rgba(71, 85, 105, 0.9)'
          ],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#1e293b',
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
              padding: 14,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#fbbf24',
            bodyColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((ctx.raw / total) * 100).toFixed(1);
                return ` Realisasi ${ctx.label}: Rp ${ctx.raw.toLocaleString('id-ID')} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // 3. Form Submit Event Handler
  promptForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const promptText = promptInput.value.trim();
    if (!promptText) return;

    setJarvisLoading(true, promptText);
    await sendPromptToN8n(promptText);
    setJarvisLoading(false);
  });

  // Quick Prompt Chips Listener
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      promptInput.value = chip.textContent.trim();
      promptForm.dispatchEvent(new Event('submit'));
    });
  });

  // 4. Fetch() to n8n Webhook
  async function sendPromptToN8n(promptText) {
    // Selalu gunakan proxy lokal (server.py) untuk menghindari CORS
    const activeUrl = '/proxy/n8n';

    if (!activeUrl) {
      showToast("Webhook n8n belum dikonfigurasi. Menampilkan simulasi data Imigrasi Babel.", "info");
      simulateJarvisResponse(promptText);
      return;
    }

    try {
      showToast("Mengirim instruksi query ke n8n Webhook...", "info");
      
      const response = await fetch(activeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prompt: promptText,
          timestamp: new Date().toISOString(),
          source: 'SIKAP_KEMENIMIPAS_BABEL'
        })
      });

      if (!response.ok) {
        throw new Error(`n8n Webhook HTTP status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Response JSON from n8n:", json);

      if (json && json.chart_data) {
        const cd = json.chart_data;
        if (cd.labels && cd.pagu && cd.realisasi) {
          currentBudgetData = {
            labels: cd.labels,
            pagu: cd.pagu.map(Number),
            realisasi: cd.realisasi.map(Number)
          };
        }
      }

      const msg = json.message || json.response || `Instruksi '${promptText}' telah diproses oleh n8n. Grafik realisasi anggaran Kanwil Kemenimipas Babel telah diperbarui.`;
      jarvisStatusHeader.textContent = "SISTEM SIKAP ONLINE // N8N WEBHOOK RESPONSE RECEIVED";
      jarvisMessageText.innerHTML = `"${escapeHtml(msg)}"`;

      updateDashboardUI();
      showToast("Grafik anggaran berhasil di-update dari n8n!", "success");

    } catch (error) {
      console.warn("n8n Webhook fallback to dynamic engine.", error);
      showToast(`Koneksi n8n Webhook gagal (${error.message}). Menggunakan simulasi.`, "error");
      simulateJarvisResponse(promptText);
    }
  }

  // Fallback Simulation Engine (Imigrasi Bangka Belitung Context)
  function simulateJarvisResponse(promptText) {
    const lower = promptText.toLowerCase();

    if (lower.includes('lantaskim') || lower.includes('inteldakim')) {
      currentBudgetData = {
        labels: ['Seksi Lantaskim', 'Seksi Inteldakim', 'Pelayanan Paspor', 'Pengawasan WNA', 'Tim Pora Babel'],
        pagu: [18500000000, 12800000000, 8000000000, 5000000000, 3000000000],
        realisasi: [15900000000, 10400000000, 6800000000, 4100000000, 2500000000]
      };
      jarvisMessageText.innerHTML = `"Menampilkan rincian penyerapan anggaran khusus <strong>Seksi Lalu Lintas Keimigrasian (Lantaskim) & Inteldakim</strong>. Serapan anggaran mencapai 82.3%."`;
    } else if (lower.includes('intalta') || lower.includes('tikim')) {
      currentBudgetData = {
        labels: ['Seksi Intalta', 'Seksi Tikim', 'Izin Tinggal ITAS/ITAP', 'Infrastruktur Jaringan', 'Sistem Informasi SIKAP'],
        pagu: [14200000000, 9500000000, 6000000000, 4500000000, 2000000000],
        realisasi: [11800000000, 7800000000, 5100000000, 3600000000, 1700000000]
      };
      jarvisMessageText.innerHTML = `"Data penyerapan <strong>Seksi Izin Tinggal (Intalta) & Teknologi Informasi (Tikim)</strong> berhasil dimuat. Penyerapan berjalan sesuai target TW-3."`;
    } else {
      currentBudgetData = {
        labels: ['Seksi Lantaskim', 'Seksi Intalta', 'Seksi Inteldakim', 'Seksi Tikim', 'Subbagian TU'],
        pagu: [18500000000, 14200000000, 12800000000, 9500000000, 7000000000],
        realisasi: [15200000000, 11400000000, 9800000000, 7100000000, 5800000000]
      };
      jarvisMessageText.innerHTML = `"Analisis <strong>Penyerapan Anggaran DIPA 2026 Kanwil Kemenimipas Bangka Belitung</strong> disajikan. Grafik Bar & Donut telah diperbarui."`;
    }

    jarvisStatusHeader.textContent = "SISTEM SIKAP // INSTRUKSI DIOLAH OLEH AI ASISTEN";
    updateDashboardUI();
    showToast("Data grafik berhasil di-render ulang!", "success");
  }

  // 5. Update UI Stats & Chart Instances
  function updateDashboardUI() {
    const totalPagu = currentBudgetData.pagu.reduce((a, b) => a + b, 0);
    const totalRealisasi = currentBudgetData.realisasi.reduce((a, b) => a + b, 0);
    const pct = totalPagu > 0 ? ((totalRealisasi / totalPagu) * 100).toFixed(1) : 0;

    statTotalPagu.textContent = `Rp ${totalPagu.toLocaleString('id-ID')}`;
    statTotalRealisasi.textContent = `Rp ${totalRealisasi.toLocaleString('id-ID')}`;
    statPctPenyerapan.textContent = `${pct}%`;

    if (pct >= 75) {
      statStatus.textContent = "OPTIMAL (SANGAT TINGGI)";
      statStatus.className = "text-lg sm:text-xl font-bold text-emerald-600 tracking-tight";
    } else if (pct >= 50) {
      statStatus.textContent = "ON TRACK (CUKUP)";
      statStatus.className = "text-lg sm:text-xl font-bold text-immi-blue tracking-tight";
    } else {
      statStatus.textContent = "PERLU PERHATIAN";
      statStatus.className = "text-lg sm:text-xl font-bold text-amber-600 tracking-tight";
    }

    const now = new Date();
    statTimestamp.textContent = `Pembaruan: ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    if (barChartInstance) {
      barChartInstance.data.labels = currentBudgetData.labels;
      barChartInstance.data.datasets[0].data = currentBudgetData.pagu;
      barChartInstance.data.datasets[1].data = currentBudgetData.realisasi;
      barChartInstance.update();
    }

    if (pieChartInstance) {
      pieChartInstance.data.labels = currentBudgetData.labels;
      pieChartInstance.data.datasets[0].data = currentBudgetData.realisasi;
      pieChartInstance.update();
    }
  }

  // 6. Loading State Controller
  function setJarvisLoading(isLoading, promptText = '') {
    if (isLoading) {
      btnSubmitPrompt.disabled = true;
      btnSubmitPrompt.classList.add('opacity-75', 'cursor-not-allowed');
      btnSubmitPrompt.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>MEMPROSES...</span>`;
      lucide.createIcons();

      jarvisStatusHeader.textContent = "SISTEM MEMPROSES // MENGHUBUNGI AUTOMATION ENGINE...";
      jarvisMessageText.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500 font-mono">Memproses instruksi: "${escapeHtml(promptText)}"</span>
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-immi-blue animate-ping"></span>
          </div>
        </div>
      `;
    } else {
      btnSubmitPrompt.disabled = false;
      btnSubmitPrompt.classList.remove('opacity-75', 'cursor-not-allowed');
      btnSubmitPrompt.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i> <span>PROSES PROMPT</span>`;
      lucide.createIcons();
    }
  }

  // 7. Modal Webhook Listeners
  btnWebhookConfig.addEventListener('click', () => {
    inputN8nWebhookUrl.value = n8nWebhookUrl;
    webhookModal.classList.remove('hidden');
    setTimeout(() => webhookModal.classList.remove('opacity-0'), 10);
  });

  function closeModal() {
    webhookModal.classList.add('opacity-0');
    setTimeout(() => webhookModal.classList.add('hidden'), 300);
  }

  btnCloseWebhookModal.addEventListener('click', closeModal);
  webhookModal.addEventListener('click', (e) => {
    if (e.target === webhookModal) closeModal();
  });

  btnSaveWebhookUrl.addEventListener('click', () => {
    n8nWebhookUrl = inputN8nWebhookUrl.value.trim();
    localStorage.setItem('jarvis_n8n_url', n8nWebhookUrl);
    updateWebhookStatusBadge();
    closeModal();
    showToast("URL Webhook n8n berhasil disimpan!", "success");
  });

  btnSimulateData.addEventListener('click', () => {
    n8nWebhookUrl = '';
    localStorage.removeItem('jarvis_n8n_url');
    updateWebhookStatusBadge();
    closeModal();
    simulateJarvisResponse("Tampilkan penyerapan anggaran 2026");
    showToast("Menggunakan Mode Simulasi Demo.", "info");
  });

  function updateWebhookStatusBadge() {
    if (n8nWebhookUrl) {
      webhookStatusText.textContent = "N8N: CONNECTOR ACTIVE";
      webhookStatusText.classList.remove('text-slate-700');
      webhookStatusText.classList.add('text-immi-blue', 'font-bold');
    } else {
      webhookStatusText.textContent = "N8N: STANDBY MODE";
    }
  }

  // 8. Voice Recognition (Speech-to-Text)
  const btnVoiceInput = document.getElementById('btnVoiceInput');
  const micIcon = document.getElementById('micIcon');
  let recognition = null;

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;

    recognition.onstart = () => {
      btnVoiceInput.classList.add('bg-red-100', 'text-red-600', 'animate-pulse');
      showToast("Mendengarkan suara... Bicara sekarang.", "info");
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      promptInput.value = speechToText;
      showToast(`Suara terdeteksi: "${speechToText}"`, "success");
    };

    recognition.onend = () => {
      btnVoiceInput.classList.remove('bg-red-100', 'text-red-600', 'animate-pulse');
    };

    recognition.onerror = () => {
      btnVoiceInput.classList.remove('bg-red-100', 'text-red-600', 'animate-pulse');
      showToast("Gagal mengenali suara.", "error");
    };

    btnVoiceInput.addEventListener('click', () => {
      try { recognition.start(); } catch(e) { recognition.stop(); }
    });
  } else {
    btnVoiceInput.style.display = 'none';
  }

  // 9. Toast Notification System
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }
});
