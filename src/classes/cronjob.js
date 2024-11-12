const cron = require("node-cron");

class CronJob {
  constructor(expression, fn, options) {
    this._instance = null;
    this._expression = expression;
    this._fn = fn;
    this._options = options;
  }

  start(expression, fn, options) {
    if (this._instance) {
      this._instance.start();
      return;
    }

    if (!expression && !this._expression)
      throw new Error("Cron Expression is required");

    if (!fn && !this._fn) throw new Error("Callback for Cron Job is required");

    this._instance = cron.schedule(expression, fn, options);
  }

  stop() {
    this._instance.stop();
  }
}

module.exports = CronJob;
