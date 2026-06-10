const path = require("path");

const AVG_NAME = "平均電價(元/度)";
const DEFAULT_XLS_PATH = path.join(__dirname, "..", "歷年電價一覽表.xls");

module.exports = {
  AVG_NAME,
  DEFAULT_XLS_PATH,
};
