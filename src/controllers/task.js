// Some tasks are sent from clients
// will be processed here.

const axios = require("axios");

const { Handler, Controller } = require("../classes/controller");

// Import middlewares
const verifyAddress = require("../middlewares/verifyAddress");

// Import services
const { PyProcessService } = require("../services/python");

const taskController = new Controller("/task");

const pyprocess = new PyProcessService();

taskController.appendHandler(
  new Handler("/deploy", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      const { headerIp, code } = req.body;

      if (!headerIp) {
        o.code = 400;
        throw new Error("The IP of Header must be specified");
      }

      if (!code) {
        o.code = 400;
        throw new Error("Code not found");
      }

      const data = await axios.post(`http://${headerIp}:9000/execute-python`, {
        code: code,
      });

      o.data = data;

      return o;
    });
  })
);

module.exports = { taskController };
