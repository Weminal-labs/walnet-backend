const HTTPUtils = require("./http");
const ErrorUtils = require("./error");
const StringUtils = require("./string");
const DatetimeUtils = require("./datetime");

class Utils {
  static Http = new HTTPUtils();
  static Error = new ErrorUtils(Utils.Http);
  static String = new StringUtils();
  static Datetime = new DatetimeUtils();
}

module.exports = Utils;
