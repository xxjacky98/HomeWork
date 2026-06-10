<script setup>
defineProps({
  startYear: {
    type: [String, Number],
    default: "",
  },
  endYear: {
    type: [String, Number],
    default: "",
  },
});

defineEmits(["update:startYear", "update:endYear", "reset-filter"]);
</script>

<template>
  <div class="filter-bar">
    <div>
      <p>資料表</p>
      <h2>年度明細</h2>
    </div>

    <div class="filter-controls">
      <label>
        <span>開始年份</span>
        <input
          :value="startYear"
          type="number"
          min="1900"
          max="2100"
          step="1"
          @input="$emit('update:startYear', $event.target.value)"
        />
      </label>
      <label>
        <span>結束年份</span>
        <input
          :value="endYear"
          type="number"
          min="1900"
          max="2100"
          step="1"
          @input="$emit('update:endYear', $event.target.value)"
        />
      </label>
      <button type="button" class="secondary" @click="$emit('reset-filter')">清除</button>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

p {
  margin: 0 0 4px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
}

h2 {
  margin: 0;
  font-size: 22px;
}

.filter-controls {
  display: flex;
  align-items: end;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

label {
  display: grid;
  gap: 6px;
}

span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

input {
  width: 142px;
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

button {
  padding: 0 16px;
}

@media (max-width: 760px) {
  .filter-bar {
    display: grid;
    align-items: start;
  }

  .filter-controls {
    justify-content: stretch;
  }

  label,
  input,
  button {
    width: 100%;
  }
}
</style>
