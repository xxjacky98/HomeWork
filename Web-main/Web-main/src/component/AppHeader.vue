<template>
  <header class="header-panel">
    <div>
      <p class="eyebrow">Homework 4</p>
      <h1>通貨膨脹觀測站</h1>
      <p class="subtitle">
        以台電歷年平均電價做為物價壓力參考，提供新增、匯入、篩選與趨勢觀察。
      </p>
    </div>

    <div class="header-metric" aria-label="資料主題">
      <span>主題</span>
      <strong>Inflation</strong>
    </div>
  </header>
</template>

<style scoped>
.header-panel {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  min-height: 188px;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(15, 118, 110, 0.1), rgba(180, 83, 9, 0.08)),
    var(--panel);
  box-shadow: var(--shadow);
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(34px, 5vw, 64px);
  line-height: 1;
  letter-spacing: 0;
}

.subtitle {
  max-width: 660px;
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.8;
}

.header-metric {
  display: grid;
  place-items: center;
  width: 164px;
  aspect-ratio: 1;
  border: 1px solid rgba(15, 118, 110, 0.25);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.68);
}

.header-metric span {
  color: var(--muted);
  font-size: 13px;
}

.header-metric strong {
  color: var(--warning);
  font-size: 28px;
}

@media (max-width: 720px) {
  .header-panel {
    align-items: flex-start;
    min-height: auto;
    padding: 22px;
  }

  .header-metric {
    display: none;
  }
}
</style>
