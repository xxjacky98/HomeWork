<script setup>
import { computed, ref } from "vue";

import StatusMessage from "./StatusMessage.vue";

const props = defineProps({
  seriesName: {
    type: String,
    required: true,
  },
  message: {
    type: Object,
    default: () => ({ text: "", kind: "info" }),
  },
});

const emit = defineEmits(["create-price"]);

const year = ref(String(new Date().getFullYear()));
const price = ref("");
const name = ref(props.seriesName);

const canSubmit = computed(() => {
  const yearNumber = Number(year.value);
  const priceNumber = Number(price.value);
  return (
    Number.isInteger(yearNumber) &&
    yearNumber >= 1900 &&
    yearNumber <= 2100 &&
    Number.isFinite(priceNumber) &&
    priceNumber > 0
  );
});

function submitForm() {
  if (!canSubmit.value) return;

  emit("create-price", {
    date: `${String(year.value).padStart(4, "0")}-01-01`,
    name: name.value,
    price: Number(price.value),
  });

  price.value = "";
}
</script>

<template>
  <section class="form-panel" aria-labelledby="price-form-title">
    <div class="section-heading">
      <p>新增資料</p>
      <h2 id="price-form-title">年度平均電價</h2>
    </div>

    <form class="price-form" @submit.prevent="submitForm">
      <label class="field">
        <span>年份</span>
        <input v-model="year" type="number" min="1900" max="2100" step="1" required />
      </label>

      <label class="field">
        <span>資料名稱</span>
        <input v-model="name" type="text" required />
      </label>

      <label class="field">
        <span>平均電價（元 / 度）</span>
        <input v-model="price" type="number" min="0" step="0.0001" inputmode="decimal" required />
      </label>

      <div class="form-actions">
        <button type="submit" :disabled="!canSubmit">新增</button>
        <StatusMessage :message="message" />
      </div>
    </form>
  </section>
</template>

<style scoped>
.form-panel {
  display: flex;
  flex-direction: column;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  box-shadow: var(--shadow);
}

.section-heading p {
  margin: 0 0 4px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
}

.section-heading h2 {
  margin: 0;
  font-size: 22px;
}

.price-form {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.field {
  display: grid;
  gap: 7px;
}

.field span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

input {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
  color: var(--text);
  outline: none;
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
}

.form-actions {
  display: grid;
  gap: 10px;
  margin-top: 4px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  box-shadow: none;
}
</style>
