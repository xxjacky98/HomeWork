<script setup>
import { computed } from "vue";

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
});

function yearFromDate(dateText) {
  return typeof dateText === "string" ? dateText.slice(0, 4) : "";
}

function formatPrice(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(4) : "--";
}

const sortedRows = computed(() =>
  [...props.rows].sort((left, right) => String(left.date).localeCompare(String(right.date))),
);

const latestRow = computed(() => sortedRows.value.at(-1));
const previousRow = computed(() => sortedRows.value.at(-2));
const averagePrice = computed(() => {
  if (!sortedRows.value.length) return null;
  const total = sortedRows.value.reduce((sum, row) => sum + Number(row.price || 0), 0);
  return total / sortedRows.value.length;
});
const latestChange = computed(() => {
  if (!latestRow.value || !previousRow.value) return null;
  return Number(latestRow.value.price) - Number(previousRow.value.price);
});

const cards = computed(() => [
  {
    label: "資料筆數",
    value: `${props.rows.length}`,
    caption: "目前篩選範圍",
  },
  {
    label: "最新年度",
    value: latestRow.value ? yearFromDate(latestRow.value.date) : "--",
    caption: latestRow.value ? `${formatPrice(latestRow.value.price)} 元 / 度` : "尚無資料",
  },
  {
    label: "年度變化",
    value:
      latestChange.value === null
        ? "--"
        : `${latestChange.value >= 0 ? "+" : ""}${latestChange.value.toFixed(4)}`,
    caption: "與前一年比較",
  },
  {
    label: "平均值",
    value: averagePrice.value === null ? "--" : formatPrice(averagePrice.value),
    caption: "篩選資料平均",
  },
]);
</script>

<template>
  <section class="summary-grid" aria-label="通貨膨脹資料摘要">
    <article v-for="card in cards" :key="card.label" class="summary-card">
      <span>{{ card.label }}</span>
      <strong>{{ card.value }}</strong>
      <p>{{ card.caption }}</p>
    </article>
  </section>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.summary-card {
  min-height: 116px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  box-shadow: var(--shadow);
}

.summary-card span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.summary-card strong {
  display: block;
  margin-top: 10px;
  color: var(--text);
  font-size: 28px;
  line-height: 1.1;
}

.summary-card p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
