<script setup>
import { computed } from "vue";

import StatusMessage from "./StatusMessage.vue";

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  message: {
    type: Object,
    default: () => ({ text: "", kind: "info" }),
  },
  seriesName: {
    type: String,
    required: true,
  },
});

defineEmits(["import-data", "reset-import"]);

const chartWidth = 640;
const chartHeight = 260;
const chartPad = { top: 24, right: 28, bottom: 46, left: 58 };
const innerWidth = chartWidth - chartPad.left - chartPad.right;
const innerHeight = chartHeight - chartPad.top - chartPad.bottom;

function yearFromDate(dateText) {
  return typeof dateText === "string" ? dateText.slice(0, 4) : "";
}

function formatPrice(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(4) : "";
}

const sortedRows = computed(() =>
  [...props.rows].sort((left, right) => String(left.date).localeCompare(String(right.date))),
);

const values = computed(() => sortedRows.value.map((row) => Number(row.price)).filter(Number.isFinite));
const minValue = computed(() => (values.value.length ? Math.min(...values.value) : 0));
const maxValue = computed(() => (values.value.length ? Math.max(...values.value) : 1));
const valueRange = computed(() => Math.max(maxValue.value - minValue.value, 0.0001));

const points = computed(() =>
  sortedRows.value.map((row, index) => {
    const x =
      chartPad.left +
      (sortedRows.value.length <= 1
        ? innerWidth / 2
        : (index / (sortedRows.value.length - 1)) * innerWidth);
    const y = chartPad.top + ((maxValue.value - Number(row.price)) / valueRange.value) * innerHeight;
    return {
      x,
      y,
      year: yearFromDate(row.date),
      price: Number(row.price),
    };
  }),
);

const linePoints = computed(() => points.value.map((point) => `${point.x},${point.y}`).join(" "));
const yTicks = computed(() => {
  const tickCount = 4;
  return Array.from({ length: tickCount + 1 }, (_, index) => {
    const ratio = index / tickCount;
    const value = maxValue.value - valueRange.value * ratio;
    return {
      value,
      y: chartPad.top + innerHeight * ratio,
    };
  });
});
const xLabels = computed(() => {
  if (points.value.length <= 3) return points.value;
  const middle = Math.floor(points.value.length / 2);
  return [points.value[0], points.value[middle], points.value[points.value.length - 1]];
});
</script>

<template>
  <section class="chart-panel" aria-labelledby="chart-title">
    <div class="panel-top">
      <div>
        <p>趨勢圖</p>
        <h2 id="chart-title">{{ seriesName }}</h2>
      </div>
      <div class="chart-actions">
        <button type="button" class="secondary" @click="$emit('import-data')">匯入 XLS</button>
        <button type="button" @click="$emit('reset-import')">重置匯入</button>
      </div>
    </div>

    <div class="chart-wrap" :aria-busy="loading">
      <svg viewBox="0 0 640 260" role="img" aria-label="年度平均電價趨勢折線圖">
        <line
          v-for="tick in yTicks"
          :key="tick.y"
          :x1="chartPad.left"
          :x2="chartWidth - chartPad.right"
          :y1="tick.y"
          :y2="tick.y"
          class="grid-line"
        />
        <text
          v-for="tick in yTicks"
          :key="`label-${tick.y}`"
          :x="chartPad.left - 10"
          :y="tick.y + 4"
          text-anchor="end"
          class="axis-label"
        >
          {{ formatPrice(tick.value) }}
        </text>

        <polyline v-if="points.length > 1" :points="linePoints" class="trend-line" />

        <g v-for="point in points" :key="`${point.year}-${point.price}`">
          <circle :cx="point.x" :cy="point.y" r="5" class="trend-point" />
          <title>{{ point.year }}：{{ formatPrice(point.price) }} 元 / 度</title>
        </g>

        <text
          v-for="point in xLabels"
          :key="`year-${point.year}`"
          :x="point.x"
          :y="chartHeight - 16"
          text-anchor="middle"
          class="axis-label"
        >
          {{ point.year }}
        </text>

        <text v-if="points.length === 0" x="320" y="130" text-anchor="middle" class="empty-label">
          尚無資料
        </text>
      </svg>
    </div>

    <StatusMessage :message="message" />
  </section>
</template>

<style scoped>
.chart-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  box-shadow: var(--shadow);
}

.panel-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: start;
}

.panel-top p {
  margin: 0 0 4px;
  color: var(--warning);
  font-size: 13px;
  font-weight: 800;
}

h2 {
  margin: 0;
  font-size: 22px;
}

.chart-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.chart-actions button {
  padding: 0 14px;
}

.chart-wrap {
  margin: 18px 0 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(238, 244, 242, 0.7), rgba(255, 255, 255, 0.95)),
    #ffffff;
  overflow: hidden;
}

svg {
  display: block;
  width: 100%;
  min-height: 260px;
}

.grid-line {
  stroke: rgba(105, 115, 134, 0.2);
  stroke-width: 1;
}

.trend-line {
  fill: none;
  stroke: var(--accent);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.trend-point {
  fill: #ffffff;
  stroke: var(--warning);
  stroke-width: 3;
}

.axis-label {
  fill: var(--muted);
  font-size: 12px;
}

.empty-label {
  fill: var(--muted);
  font-size: 15px;
  font-weight: 700;
}

@media (max-width: 620px) {
  .panel-top {
    display: grid;
  }

  .chart-actions {
    justify-content: stretch;
  }

  .chart-actions button {
    flex: 1 1 120px;
  }
}
</style>
