const path = require("path");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const { initDb } = require("./src/db");
const { registerApiRoutes } = require("./src/routes");

async function main() {
  await initDb();

  const app = express();
  app.use(morgan("dev"));
  app.use(express.json({ limit: "100kb" }));

  registerApiRoutes(app);

  const distDir = path.join(__dirname, "dist");
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  } else {
    app.get("/", (_req, res) => {
      res.type("text/plain").send("Vue dev server: run `npm run dev` and open http://localhost:5173");
    });
  }

  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
