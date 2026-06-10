# 作業4 通貨膨脹觀測站

這份作業已改寫成 Vue 3 + Vite 專案，後端保留 Express + SQLite API。前端以 SFC 拆成多個元件，`index.html` 與 `src/main.js` 只保留 Vue 入口需要的最小程式碼。

## 執行方式

```bash
npm install
npm run dev
```

開啟 `http://localhost:5173`。

## 專案結構

- `index.html`：乾淨的 Vite HTML 入口。
- `src/main.js`：只掛載 Vue App。
- `src/App.vue`：組織頁面資料流與元件。
- `src/component/`：所有 Vue SFC 元件。
- `server.js`：Express API 與正式建置後的 `dist` 靜態服務。

## API

- `GET /api/prices`
- `POST /api/prices`
- `POST /api/taipower/import`
- `POST /api/taipower/reset-import`

若要用正式模式，先執行 `npm run build`，再執行 `npm start`，服務會開在 `http://localhost:3001`。
