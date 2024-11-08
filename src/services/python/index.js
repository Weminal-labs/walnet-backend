const path = require("path");
const { spawn } = require("child_process");

const Utils = require("../../utils");

// Define global
const root = Utils.String.getRootDir();

/**
 * @typedef {keyof PyProcessService.ScriptPaths} ScriptPathKeys
 */

class PyProcessService {
  constructor() {
    this.pythonPath = process.env.PYTHON_PATH || "python3";
  }

  /**
   * Dùng phương thức này để tạo ra một python executer.
   * @param {ScriptPathKeys} script
   * @param  {...any} args
   * @returns
   */
  exec(...args) {
    // Use python3 (Linux)
    const py_process = spawn(this.pythonPath, [
      root + "/python/main.py",
      ...args,
    ]);

    try {
      return new Promise(function (resolve, reject) {
        py_process.stdout.on("data", (data) => {
          data = data.toString();
          console.log(data);
          data = JSON.parse(data);
          if (!data.error) {
            resolve(data);
          } else {
            reject(data);
          }
        });

        py_process.stderr.on("data", (data) => {
          data = data.toString();
          reject({ message: `There is an error! - ${data}` });
        });
      });
    } catch (error) {
      console.error("PyProcess Error: ", error);
      return Promise.resolve(false);
    }
  }
}

module.exports = { PyProcessService };
