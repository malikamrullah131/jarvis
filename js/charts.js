/**
 * SIKAP Interactive Charts Module
 * Context: Kanwil Kemenimipas Bangka Belitung
 * Renders Bar Chart & Circle/Donut Chart with Government Theme Palette
 */

window.ChartsModule = (function () {
  let barChartInstance = null;
  let circleChartInstance = null;

  // Chart Color System
  const COLORS = {
    navy: '#0f172a',
    blue: '#1e3a8a',
    blueBright: '#1d4ed8',
    gold: '#f59e0b',
    emerald: '#10b981',
    teal: '#0d9488',
    gridLines: '#e2e8f0',
    textMuted: '#64748b'
  };

  /**
   * Inisialisasi Chart Canvas saat aplikasi dimuat
   */
  function initCharts() {
    const barCtx = document.getElementById('barChartCanvas');
    const circleCtx = document.getElementById('circleChartCanvas');

    if (!barCtx || !circleCtx) return;

    if (barChartInstance) barChartInstance.destroy();
    if (circleChartInstance) circleChartInstance.destroy();

    // 1. Bar Chart Setup
    barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Total Realisasi (Rp)',
          data: [],
          backgroundColor: 'rgba(30, 58, 138, 0.85)',
          borderColor: COLORS.blue,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#fbbf24',
            bodyColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => ` Total: Rp ${context.raw.toLocaleString('id-ID')}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: COLORS.gridLines },
            ticks: { color: COLORS.textMuted, font: { family: 'Plus Jakarta Sans', size: 12 } }
          },
          y: {
            grid: { color: COLORS.gridLines },
            ticks: {
              color: COLORS.textMuted,
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (value) => `Rp ${(value / 1000000000).toFixed(1)} M`
            }
          }
        }
      }
    });

    // 2. Circle / Donut Chart Setup
    circleChartInstance = new Chart(circleCtx, {
      type: 'doughnut',
      data: {
        labels: ['Sangat Baik', 'Optimal', 'Perlu Dorongan'],  // Bug #3 Fix: match actual DB status values
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(16, 185, 129, 0.9)',
            'rgba(245, 158, 11, 0.9)',
            'rgba(239, 68, 68, 0.9)'
          ],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: COLORS.textMuted,
              font: { family: 'Plus Jakarta Sans', size: 12 },
              padding: 16,
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
              label: (context) => ` ${context.label}: ${context.raw} catatan`
            }
          }
        }
      }
    });

    updateCharts();
  }

  /**
   * Update data grafik dari lokal DatabaseManager
   */
  // Bug #8 Fix: renamed parameter from `filterFilter` to `filter` (typo)
  // Bug #3 Fix: use correct field names `bidang_bagian` and `realisasi` (not `category`/`value`)
  //             use correct status values: "Sangat Baik", "Optimal", "Perlu Dorongan"
  function updateCharts(filter = "all") {
    if (!window.DatabaseManager) return;

    let records = window.DatabaseManager.getAllRecords();

    if (filter === "completed") {
      records = records.filter(r => r.status === "Sangat Baik");
    } else if (filter === "pending") {
      records = records.filter(r => r.status === "Optimal" || r.status === "Perlu Dorongan");
    }

    const categoryTotals = {};
    records.forEach(r => {
      const cat = r.bidang_bagian || "General";     // Bug #3 Fix: was `r.category`
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (r.realisasi || 0);  // Bug #3 Fix: was `r.value`
    });

    const categories = Object.keys(categoryTotals);
    const categoryValues = Object.values(categoryTotals);

    if (barChartInstance) {
      barChartInstance.data.labels = categories.length > 0 ? categories : ["Tanpa Data"];
      barChartInstance.data.datasets[0].data = categoryValues.length > 0 ? categoryValues : [0];
      barChartInstance.update();
    }

    // Bug #3 Fix: use correct status strings matching DatabaseManager
    const statusCounts = {
      SangatBaik: records.filter(r => r.status === "Sangat Baik").length,
      Optimal: records.filter(r => r.status === "Optimal").length,
      PerluDorongan: records.filter(r => r.status === "Perlu Dorongan").length
    };

    if (circleChartInstance) {
      circleChartInstance.data.datasets[0].data = [
        statusCounts.SangatBaik,
        statusCounts.Optimal,
        statusCounts.PerluDorongan
      ];
      circleChartInstance.update();
    }
  }

  /**
   * Render grafik secara dinamis saat menerima data dari n8n Webhook
   */
  function renderN8nCharts(chartData) {
    if (!chartData) return;

    // 1. Update Bar Chart
    if (chartData.bar_chart && barChartInstance) {
      barChartInstance.data.labels = chartData.bar_chart.labels || [];

      if (chartData.bar_chart.datasets) {
        barChartInstance.data.datasets = chartData.bar_chart.datasets.map((ds, index) => ({
          label: ds.label || 'Nilai',
          data: ds.data || [],
          backgroundColor: index === 0 ? 'rgba(30, 58, 138, 0.85)' : 'rgba(16, 185, 129, 0.85)',
          borderColor: index === 0 ? COLORS.blue : COLORS.emerald,
          borderWidth: 1.5,
          borderRadius: 6
        }));
      }
      barChartInstance.update();
    }

    // 2. Update Donut/Pie Chart
    if (chartData.pie_chart && circleChartInstance) {
      circleChartInstance.data.labels = chartData.pie_chart.labels || [];
      if (chartData.pie_chart.data) {
        circleChartInstance.data.datasets[0].data = chartData.pie_chart.data;
      }
      circleChartInstance.update();
    }
  }

  // Expose public API
  return {
    initCharts,
    updateCharts,
    renderN8nCharts
  };
})();