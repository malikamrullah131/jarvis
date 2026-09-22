/* global lucide */
/**
 * SIKAP AI - Main Application Controller
 * Handles Data Table rendering, CRUD actions, DIPA calculations, n8n Sync, and Live Webhook Debugger.
 * Context: Kanwil Kemenimipas Bangka Belitung
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // State Variables
  let currentPage = 1;
  const itemsPerPage = 5;
  let activeSearchTerm = "";
  let activeSeksiFilter = "all";
  let activeStatusFilter = "all";

  // DOM Elements - Table & Filters
  const dipaTableBody = document.getElementById('dipaTableBody');
  const tableSearchInput = document.getElementById('tableSearchInput');
  const tableSeksiFilter = document.getElementById('tableSeksiFilter');
  const tableStatusFilter = document.getElementById('tableStatusFilter');
  const dipaTableCountText = document.getElementById('dipaTableCountText');
  const dipaPageIndicator = document.getElementById('dipaPageIndicator');
  const btnDipaPrevPage = document.getElementById('btnDipaPrevPage');
  const btnDipaNextPage = document.getElementById('btnDipaNextPage');
  const btnSyncTableN8n = document.getElementById('btnSyncTableN8n');
  const syncTableIcon = document.getElementById('syncTableIcon');

  // Modal Elements - Add/Edit
  const btnOpenAddRecordModal = document.getElementById('btnOpenAddRecordModal');
  const dipaRecordModal = document.getElementById('dipaRecordModal');
  const btnCloseDipaModal = document.getElementById('btnCloseDipaModal');
  const btnCancelDipaModal = document.getElementById('btnCancelDipaModal');
  const dipaRecordForm = document.getElementById('dipaRecordForm');
  const dipaModalTitle = document.getElementById('dipaModalTitle');

  // Form Fields
  const editRecordId = document.getElementById('editRecordId');
  const fieldDipaId = document.getElementById('fieldDipaId');
  const fieldDipaSeksi = document.getElementById('fieldDipaSeksi');
  const fieldDipaTitle = document.getElementById('fieldDipaTitle');
  const fieldDipaPagu = document.getElementById('fieldDipaPagu');
  const fieldDipaRealisasi = document.getElementById('fieldDipaRealisasi');
  const fieldDipaStatus = document.getElementById('fieldDipaStatus');
  const fieldDipaDate = document.getElementById('fieldDipaDate');

  // Webhook Modal Tabs & Tester Elements
  const tabBtnConfig = document.getElementById('tabBtnConfig');
  const tabBtnTester = document.getElementById('tabBtnTester');
  const tabBtnLogs = document.getElementById('tabBtnLogs');
  const tabContentConfig = document.getElementById('tabContentConfig');
  const tabContentTester = document.getElementById('tabContentTester');
  const tabContentLogs = document.getElementById('tabContentLogs');

  const testerActionSelect = document.getElementById('testerActionSelect');
  const testerEndpointStatus = document.getElementById('testerEndpointStatus');
  const testerRequestJson = document.getElementById('testerRequestJson');
  const btnResetTesterPayload = document.getElementById('btnResetTesterPayload');
  const btnRunWebhookTest = document.getElementById('btnRunWebhookTest');
  const testRunIcon = document.getElementById('testRunIcon');
  const responseStatusBadge = document.getElementById('responseStatusBadge');
  const responseLatencyText = document.getElementById('responseLatencyText');
  const testerResponseJson = document.getElementById('testerResponseJson');
  const logTableBody = document.getElementById('logTableBody');
  const logCountBadge = document.getElementById('logCountBadge');
  const btnClearLogs = document.getElementById('btnClearLogs');

  // 1. Initial Render
  renderTable();
  initWebhookDebuggerTabs();

  // 2. Search & Filter Listeners
  if (tableSearchInput) {
    tableSearchInput.addEventListener('input', (e) => {
      activeSearchTerm = e.target.value.toLowerCase();
      currentPage = 1;
      renderTable();
    });
  }

  if (tableSeksiFilter) {
    tableSeksiFilter.addEventListener('change', (e) => {
      activeSeksiFilter = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  if (tableStatusFilter) {
    tableStatusFilter.addEventListener('change', (e) => {
      activeStatusFilter = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  // Pagination Listeners
  if (btnDipaPrevPage) {
    btnDipaPrevPage.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  if (btnDipaNextPage) {
    btnDipaNextPage.addEventListener('click', () => {
      const totalPages = Math.ceil(getFilteredRecords().length / itemsPerPage) || 1;
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
  }

  // Sync n8n Engine Button
  if (btnSyncTableN8n) {
    btnSyncTableN8n.addEventListener('click', async () => {
      if (syncTableIcon) syncTableIcon.classList.add('animate-spin');
      showToastNotification("Mengirim sinkronisasi seluruh tabel DIPA ke n8n...", "info");

      const records = window.DatabaseManager ? window.DatabaseManager.getAllRecords() : [];

      for (const rec of records) {
        if (window.ApiService) {
          await window.ApiService.syncRecord(rec, "sync");
        }
      }

      setTimeout(() => {
        if (syncTableIcon) syncTableIcon.classList.remove('animate-spin');
        showToastNotification(`Sinkronisasi selesai! ${records.length} data DIPA disinkronkan.`, "success");
      }, 1000);
    });
  }

  // 3. Modal Add / Edit Listeners
  if (btnOpenAddRecordModal) {
    btnOpenAddRecordModal.addEventListener('click', () => {
      openModal(null);
    });
  }

  function openModal(record = null) {
    dipaRecordForm.reset();

    if (record) {
      dipaModalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-immi-blue"></i> Edit Realisasi DIPA`;
      editRecordId.value = record.id;
      fieldDipaId.value = record.id;
      fieldDipaId.disabled = true;
      fieldDipaSeksi.value = record.category || "Seksi Lantaskim";
      fieldDipaTitle.value = record.title || "";
      fieldDipaPagu.value = record.pagu || 0;
      fieldDipaRealisasi.value = record.value || 0;
      fieldDipaStatus.value = record.status || "Terverifikasi";
      fieldDipaDate.value = record.date || new Date().toISOString().split('T')[0];
    } else {
      dipaModalTitle.innerHTML = `<i data-lucide="plus-circle" class="w-5 h-5 text-immi-blue"></i> Tambah Realisasi DIPA`;
      editRecordId.value = "";
      fieldDipaId.disabled = false;
      fieldDipaId.value = `DIPA-BBL-${Math.floor(100 + Math.random() * 900)}`;
      fieldDipaDate.value = new Date().toISOString().split('T')[0];
    }

    if (window.lucide) lucide.createIcons();
    dipaRecordModal.classList.remove('hidden');
    setTimeout(() => dipaRecordModal.classList.remove('opacity-0'), 10);
  }

  function closeModal() {
    dipaRecordModal.classList.add('opacity-0');
    setTimeout(() => dipaRecordModal.classList.add('hidden'), 300);
  }

  if (btnCloseDipaModal) btnCloseDipaModal.addEventListener('click', closeModal);
  if (btnCancelDipaModal) btnCancelDipaModal.addEventListener('click', closeModal);

  if (dipaRecordForm) {
    dipaRecordForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isEdit = !!editRecordId.value;
      const recordData = {
        id: fieldDipaId.value.trim(),
        title: fieldDipaTitle.value.trim(),
        category: fieldDipaSeksi.value,
        pagu: parseFloat(fieldDipaPagu.value) || 0,
        value: parseFloat(fieldDipaRealisasi.value) || 0,
        status: fieldDipaStatus.value,
        date: fieldDipaDate.value
      };

      let savedRecord = null;

      if (isEdit) {
        savedRecord = window.DatabaseManager.updateRecord(recordData.id, recordData);
        showToastNotification(`Data ${recordData.id} berhasil diperbarui.`, "success");
      } else {
        savedRecord = window.DatabaseManager.addRecord(recordData);
        showToastNotification(`Data baru ${recordData.id} berhasil ditambahkan.`, "success");
      }

      if (window.ApiService && savedRecord) {
        window.ApiService.syncRecord(savedRecord, isEdit ? "update" : "add");
      }

      closeModal();
      renderTable();
    });
  }

  // 4. Webhook Live Debugger Tabs Initialization
  function initWebhookDebuggerTabs() {
    if (!tabBtnConfig || !tabBtnTester || !tabBtnLogs) return;

    function switchTab(activeTab) {
      [tabBtnConfig, tabBtnTester, tabBtnLogs].forEach(btn => {
        btn.classList.remove('border-immi-blue', 'text-immi-blue');
        btn.classList.add('border-transparent', 'text-slate-500');
      });

      [tabContentConfig, tabContentTester, tabContentLogs].forEach(cnt => cnt.classList.add('hidden'));

      if (activeTab === 'config') {
        tabBtnConfig.classList.add('border-immi-blue', 'text-immi-blue');
        tabBtnConfig.classList.remove('border-transparent', 'text-slate-500');
        tabContentConfig.classList.remove('hidden');
      } else if (activeTab === 'tester') {
        tabBtnTester.classList.add('border-immi-blue', 'text-immi-blue');
        tabBtnTester.classList.remove('border-transparent', 'text-slate-500');
        tabContentTester.classList.remove('hidden');
        updateTesterStatus();
        updateSamplePayload();
      } else if (activeTab === 'logs') {
        tabBtnLogs.classList.add('border-immi-blue', 'text-immi-blue');
        tabBtnLogs.classList.remove('border-transparent', 'text-slate-500');
        tabContentLogs.classList.remove('hidden');
        renderWebhookLogs();
      }
    }

    tabBtnConfig.addEventListener('click', () => switchTab('config'));
    tabBtnTester.addEventListener('click', () => switchTab('tester'));
    tabBtnLogs.addEventListener('click', () => switchTab('logs'));

    if (testerActionSelect) testerActionSelect.addEventListener('change', updateSamplePayload);
    if (btnResetTesterPayload) btnResetTesterPayload.addEventListener('click', updateSamplePayload);

    if (btnClearLogs) {
      btnClearLogs.addEventListener('click', () => {
        if (window.ApiService) {
          window.ApiService.clearWebhookLogs();
          renderWebhookLogs();
          showToastNotification("Log transaksi berhasil dibersihkan.", "info");
        }
      });
    }

    if (btnRunWebhookTest) {
      btnRunWebhookTest.addEventListener('click', async () => {
        let payload = {};
        try {
          payload = JSON.parse(testerRequestJson.value);
        } catch {
          showToastNotification("Format Request JSON tidak valid!", "error");
          return;
        }

        btnRunWebhookTest.disabled = true;
        btnRunWebhookTest.classList.add('opacity-75');
        if (testRunIcon) testRunIcon.classList.add('animate-spin');

        const n8nWebhookUrl = '/proxy/n8n';
        const startTime = Date.now();

        try {
          // Mengirimkan request tanpa timeout abort controller (menunggu hingga n8n selesai)
          const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const resData = await response.json();
          const latency = Date.now() - startTime;

          if (responseStatusBadge) {
            responseStatusBadge.textContent = `${response.status} ${response.statusText}`;
            responseStatusBadge.className = response.ok
              ? "px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300"
              : "px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-300";
          }

          if (responseLatencyText) responseLatencyText.textContent = `${latency} ms`;
          if (testerResponseJson) testerResponseJson.textContent = JSON.stringify(resData, null, 2);

          // RENDER GRAFIK SECARA OTOMATIS JIKA BALASAN DARI N8N MENGANDUNG CHART_DATA
          if (resData.chart_data && window.ChartsModule && typeof window.ChartsModule.renderN8nCharts === 'function') {
            window.ChartsModule.renderN8nCharts(resData.chart_data);
          }

          showToastNotification(`Pengujian Webhook Selesai! (${response.status})`, response.ok ? "success" : "info");
          renderWebhookLogs();

        } catch (error) {
          console.error("Gagal terhubung ke Webhook n8n:", error);
          if (responseStatusBadge) {
            responseStatusBadge.textContent = "ERROR / Network Error";
            responseStatusBadge.className = "px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-300";
          }
          if (testerResponseJson) testerResponseJson.textContent = JSON.stringify({ error: error.message }, null, 2);
          showToastNotification("Gagal terhubung ke server n8n!", "error");
        } finally {
          btnRunWebhookTest.disabled = false;
          btnRunWebhookTest.classList.remove('opacity-75');
          if (testRunIcon) testRunIcon.classList.remove('animate-spin');
        }
      });
    }
  }

  function updateTesterStatus() {
    const currentUrl = localStorage.getItem('jarvis_n8n_url');
    if (testerEndpointStatus) {
      if (currentUrl) {
        testerEndpointStatus.innerHTML = `<span class="text-emerald-600 font-bold">● ONLINE:</span> ${escapeHtml(currentUrl)}`;
      } else {
        testerEndpointStatus.innerHTML = `<span class="text-amber-600 font-bold">● STANDBY:</span> Engine Simulasi Lokal SIKAP`;
      }
    }
  }

  function updateSamplePayload() {
    if (!testerActionSelect || !testerRequestJson) return;
    const action = testerActionSelect.value;
    let sample = {};

    if (action === "query") {
      sample = {
        action: "query",
        prompt: "Tampilkan penyerapan anggaran Seksi Lantaskim 2026",
        source: "SIKAP_LIVE_TESTER",
        timestamp: new Date().toISOString()
      };
    } else if (action === "add" || action === "update") {
      sample = {
        action: action,
        source: "SIKAP_LIVE_TESTER",
        timestamp: new Date().toISOString(),
        item: {
          id: "DIPA-TEST-999",
          title: "Pengadaan Perangkat Server Uji Coba n8n",
          category: "Seksi Tikim",
          pagu: 1500000000,
          value: 1200000000,
          status: "Terverifikasi",
          date: new Date().toISOString().split('T')[0]
        }
      };
    } else if (action === "delete") {
      sample = {
        action: "delete",
        source: "SIKAP_LIVE_TESTER",
        timestamp: new Date().toISOString(),
        item: { id: "DIPA-TEST-999" }
      };
    }

    testerRequestJson.value = JSON.stringify(sample, null, 2);
  }

  function renderWebhookLogs() {
    if (!logTableBody || !window.ApiService) return;
    const logs = window.ApiService.getWebhookLogs();

    if (logCountBadge) logCountBadge.textContent = logs.length;
    logTableBody.innerHTML = '';

    if (logs.length === 0) {
      logTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center p-4 text-slate-400 font-sans">Belum ada riwayat transaksi webhook.</td>
        </tr>
      `;
      return;
    }

    logs.forEach(log => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-50 border-b border-slate-100";
      tr.innerHTML = `
        <td class="p-2.5 text-slate-600">${escapeHtml(log.timestamp)}</td>
        <td class="p-2.5 font-bold text-immi-blue">${escapeHtml(log.action || "post")}</td>
        <td class="p-2.5 font-bold">${escapeHtml(log.status)}</td>
        <td class="p-2.5 text-slate-500">${escapeHtml(log.latency)}</td>
        <td class="p-2.5 text-center">
          <button class="btn-inspect-log px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans text-[10px]" data-log-id="${log.id}">
            Inspeksi
          </button>
        </td>
      `;
      logTableBody.appendChild(tr);
    });

    document.querySelectorAll('.btn-inspect-log').forEach(btn => {
      btn.addEventListener('click', () => {
        const logId = btn.getAttribute('data-log-id');
        const log = window.ApiService.getWebhookLogs().find(l => l.id === logId);
        if (log && testerResponseJson) {
          if (tabBtnTester) tabBtnTester.click();
          if (testerRequestJson) testerRequestJson.value = JSON.stringify(log.payload, null, 2);
          if (testerResponseJson) testerResponseJson.textContent = JSON.stringify(log.response, null, 2);
          if (responseStatusBadge) responseStatusBadge.textContent = log.status;
          if (responseLatencyText) responseLatencyText.textContent = log.latency;
        }
      });
    });
  }

  // 5. Table Filter & Render Functions
  function getFilteredRecords() {
    if (!window.DatabaseManager) return [];
    let records = window.DatabaseManager.getAllRecords();

    if (activeSearchTerm) {
      records = records.filter(r =>
        (r.id && r.id.toLowerCase().includes(activeSearchTerm)) ||
        (r.title && r.title.toLowerCase().includes(activeSearchTerm)) ||
        (r.category && r.category.toLowerCase().includes(activeSearchTerm))
      );
    }

    if (activeSeksiFilter !== "all") {
      records = records.filter(r => r.category === activeSeksiFilter);
    }

    if (activeStatusFilter !== "all") {
      records = records.filter(r => r.status === activeStatusFilter);
    }

    return records;
  }

  function renderTable() {
    if (!dipaTableBody) return;

    const filtered = getFilteredRecords();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    dipaTableBody.innerHTML = '';

    if (paginatedItems.length === 0) {
      dipaTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center p-6 text-slate-400 font-medium">
            Tidak ada transaksi DIPA yang sesuai dengan kriteria pencarian.
          </td>
        </tr>
      `;
    } else {
      paginatedItems.forEach(item => {
        const pagu = item.pagu || 0;
        const realisasi = item.value || 0;
        const pct = pagu > 0 ? ((realisasi / pagu) * 100).toFixed(1) : 0;

        let statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (item.status === "Dalam Proses" || item.status === "Processing") {
          statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
        } else if (item.status === "Pending") {
          statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
        }

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/80 transition border-b border-slate-100";
        tr.innerHTML = `
          <td class="p-3.5 font-mono font-bold text-immi-blue">${escapeHtml(item.id)}</td>
          <td class="p-3.5">
            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
              ${escapeHtml(item.category || "Seksi Lantaskim")}
            </span>
          </td>
          <td class="p-3.5 font-semibold text-slate-900">${escapeHtml(item.title)}</td>
          <td class="p-3.5 text-right font-mono font-medium">Rp ${pagu.toLocaleString('id-ID')}</td>
          <td class="p-3.5 text-right font-mono font-bold text-emerald-700">Rp ${realisasi.toLocaleString('id-ID')}</td>
          <td class="p-3.5 text-center font-mono font-bold text-immi-goldDark">${pct}%</td>
          <td class="p-3.5 text-center">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadgeClass}">
              ${escapeHtml(item.status)}
            </span>
          </td>
          <td class="p-3.5 text-center">
            <div class="flex items-center justify-center gap-1">
              <button class="btn-edit-item p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition" data-id="${item.id}" title="Edit Data">
                <i data-lucide="edit" class="w-3.5 h-3.5"></i>
              </button>
              <button class="btn-delete-item p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition" data-id="${item.id}" title="Hapus Data">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </td>
        `;

        dipaTableBody.appendChild(tr);
      });
    }

    document.querySelectorAll('.btn-edit-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = window.DatabaseManager.getRecordById(id);
        if (item) openModal(item);
      });
    });

    document.querySelectorAll('.btn-delete-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Apakah Anda yakin ingin menghapus data DIPA ${id}?`)) {
          const item = window.DatabaseManager.getRecordById(id);
          window.DatabaseManager.deleteRecord(id);
          if (window.ApiService && item) {
            window.ApiService.syncRecord(item, "delete");
          }
          showToastNotification(`Data DIPA ${id} berhasil dihapus.`, "info");
          renderTable();
        }
      });
    });

    if (dipaTableCountText) dipaTableCountText.textContent = `Menampilkan ${paginatedItems.length} dari ${totalItems} data DIPA`;
    if (dipaPageIndicator) dipaPageIndicator.textContent = `${currentPage} / ${totalPages}`;
    if (btnDipaPrevPage) btnDipaPrevPage.disabled = currentPage === 1;
    if (btnDipaNextPage) btnDipaNextPage.disabled = currentPage === totalPages;

    if (window.lucide) lucide.createIcons();
  }

  function showToastNotification(message, type = "info") {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }
});