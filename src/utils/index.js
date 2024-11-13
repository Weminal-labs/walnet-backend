const HTTPUtils = require("./http");
const ErrorUtils = require("./error");
const StringUtils = require("./string");
const DatetimeUtils = require("./datetime");
const ConvertUtils = require("./convert");
const NumberUtils = require("./number");

class Utils {
  static Http = new HTTPUtils();
  static Error = new ErrorUtils(Utils.Http);
  static String = new StringUtils();
  static Datetime = new DatetimeUtils();
  static Convert = new ConvertUtils();
  static Number = new NumberUtils();
}

module.exports = Utils;
