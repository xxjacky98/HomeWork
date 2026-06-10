<script setup>
defineProps({
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
  return Number.isFinite(number) ? number.toFixed(4) : "";
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>年份</th>
          <th class="number">平均電價</th>
          <th>建立時間</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td colspan="3" class="empty">尚無符合條件的資料</td>
        </tr>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ yearFromDate(row.date) }}</td>
          <td class="number">{{ formatPrice(row.price) }} 元 / 度</td>
          <td>{{ formatTime(row.created_at) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
}

table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  background: #ffffff;
}

th,
td {
  padding: 13px 14px;
  border-bottom: 1px solid var(--line);
  text-align: left;
  vertical-align: middle;
}

th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--panel-soft);
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
}

tr:last-child td {
  border-bottom: 0;
}

tbody tr:nth-child(even) td {
  background: #fbfcfe;
}

.number {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.empty {
  color: var(--muted);
  text-align: center;
}
</style>
