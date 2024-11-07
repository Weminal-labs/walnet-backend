const path = require("path");

class StringUtils {
  constructor() {}

  getPath(...parts) {
    let result = "";

    for (const part of parts) {
      if (part[0] !== "/") result += "/" + part;
      else result += part.replace(/\/{2,}/, "/");
    }

    if (result[0] !== "/") return "/" + result;

    return result;
  }

  getRootDir() {
    return process.cwd();
  }

  getRootDirTo(...parts) {
    return path.resolve(this.getRootDir(), ...parts);
  }
}

module.exports = StringUtils;