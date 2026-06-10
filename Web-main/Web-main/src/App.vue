<script setup>
import { computed, onMounted, ref } from "vue";

import AppHeader from "./component/AppHeader.vue";
import InflationChart from "./component/InflationChart.vue";
import PriceForm from "./component/PriceForm.vue";
import PriceTable from "./component/PriceTable.vue";
import SummaryCards from "./component/SummaryCards.vue";
import YearFilter from "./component/YearFilter.vue";

const AVG_NAME = "平均電價(元/度)";

const rows = ref([]);
const startYear = ref("");
const endYear = ref("");
const isLoading = ref(false);
const formMessage = ref({ text: "", kind: "info" });
const importMessage = ref({ text: "", kind: "info" });

function yearFromDate(dateText) {
  return typeof dateText === "string" ? dateText.slice(0, 4) : "";
}

function filterByYearRange(items) {
  const start = String(startYear.value).trim();
  const end = String(endYear.value).trim();
  const hasStart = start.length > 0;
  const hasEnd = end.length > 0;
  const startNumber = Number(start);
  const endNumber = Number(end);

  return items.filter((item) => {
    const year = Number(yearFromDate(item.date));
    if (!Number.isFinite(year)) return false;
    if (hasStart && (!Number.isFinite(startNumber) || year < startNumber)) return false;
    if (hasEnd && (!Number.isFinite(endNumber) || year > endNumber)) return false;
    return true;
  });
}

const filteredRows = computed(() => filterByYearRange(rows.value));

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
}

async function loadRows() {
  isLoading.value = true;
  try {
    rows.value = await requestJson("/api/prices");
  } finally {
    isLoading.value = false;
  }
}

async function handleCreatePrice(payload) {
  formMessage.value = { text: "新增中...", kind: "info" };

  try {
    await requestJson("/api/prices", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await loadRows();
    formMessage.value = { text: "已新增一筆年度資料", kind: "ok" };
  } catch (error) {
    formMessage.value = {
      text: error instanceof Error ? error.message : "新增失敗",
      kind: "error",
    };
  }
}

async function handleImport(endpoint, successText) {
  importMessage.value = { text: "資料處理中...", kind: "info" };

  try {
    const result = await requestJson(endpoint, { method: "POST" });
    await loadRows();
    importMessage.value = {
      text: `${successText}，共 ${result.inserted ?? 0} 筆`,
      kind: "ok",
    };
  } catch (error) {
    importMessage.value = {
      text: error instanceof Error ? error.message : "匯入失敗",
      kind: "error",
    };
  }
}

function resetFilter() {
  startYear.value = "";
  endYear.value = "";
}

onMounted(async () => {
  try {
    await loadRows();
  } catch (error) {
    formMessage.value = {
      text: error instanceof Error ? error.message : "讀取資料失敗",
      kind: "error",
    };
  }
});
</script>

<template>
  <main class="app-shell">
    <AppHeader />

    <SummaryCards :rows="filteredRows" />

    <section class="workspace-grid" aria-label="通貨膨脹資料操作">
      <PriceForm
        :series-name="AVG_NAME"
        :message="formMessage"
        @create-price="handleCreatePrice"
      />

      <InflationChart
        :rows="filteredRows"
        :loading="isLoading"
        :message="importMessage"
        :series-name="AVG_NAME"
        @import-data="handleImport('/api/taipower/import', '已匯入歷年平均電價')"
        @reset-import="handleImport('/api/taipower/reset-import', '已重置並重新匯入')"
      />
    </section>

    <section class="data-section" aria-label="年度通貨膨脹資料表">
      <YearFilter
        v-model:start-year="startYear"
        v-model:end-year="endYear"
        @reset-filter="resetFilter"
      />

      <PriceTable :rows="filteredRows" />
    </section>
  </main>
</template>

<style>
:root {
  --bg: #f5f7fb;
  --panel: #ffffff;
  --panel-soft: #eef4f2;
  --text: #18212f;
  --muted: #697386;
  --line: #d9e0e8;
  --accent: #0f766e;
  --accent-dark: #115e59;
  --warning: #b45309;
  --danger: #c24155;
  --ok: #15803d;
  --shadow: 0 18px 42px rgba(24, 33, 47, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background:
    linear-gradient(180deg, rgba(245, 247, 251, 0.94), rgba(245, 247, 251, 1)),
    repeating-linear-gradient(
      90deg,
      rgba(15, 118, 110, 0.08) 0,
      rgba(15, 118, 110, 0.08) 1px,
      transparent 1px,
      transparent 72px
    );
  color: var(--text);
  font-family:
    "Noto Sans TC",
    "Microsoft JhengHei",
    "PingFang TC",
    system-ui,
    -apple-system,
    sans-serif;
}

button,
input {
  font: inherit;
}

button {
  min-height: 42px;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
  transition:
    background 0.16s ease,
    transform 0.16s ease,
    box-shadow 0.16s ease;
}

button:hover {
  background: var(--accent-dark);
  box-shadow: 0 10px 18px rgba(15, 118, 110, 0.18);
}

button:active {
  transform: translateY(1px);
}

button.secondary {
  border: 1px solid var(--line);
  background: #ffffff;
  color: var(--text);
}

button.secondary:hover {
  background: #f8fafc;
  box-shadow: none;
}

.app-shell {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 48px;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.6fr);
  gap: 16px;
  align-items: stretch;
  margin-top: 16px;
}

.data-section {
  margin-top: 16px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  box-shadow: var(--shadow);
}

@media (max-width: 860px) {
  .app-shell {
    width: min(100% - 24px, 680px);
    padding-top: 20px;
  }

  .workspace-grid {
    grid-template-columns: 1fr;
  }
}
</style>
