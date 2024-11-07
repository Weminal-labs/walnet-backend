const { Handler, Controller } = require("../classes/controller");

// Import middlewares

const nodeController = new Controller("/node");

nodeController.appendHandler(
  new Handler("/register", "get", [], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/destroy", "get", [], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      return o;
    });
  })
);

module.exports = { nodeController };
