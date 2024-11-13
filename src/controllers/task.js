// Some tasks are sent from clients
// will be processed here.

const axios = require("axios");

const { Handler, Controller } = require("../classes/controller");

// Import middlewares
const verifyAddress = require("../middlewares/verifyAddress");
const verifyDeployment = require("../middlewares/verifyDeployment");

const taskController = new Controller("/task");

taskController.appendHandler(
  new Handler(
    "/execute-python",
    "post",
    [verifyAddress, verifyDeployment],
    function (req, res) {
      return this.utils.Error.handleResponseError(
        this,
        res,
        async function (o) {
          const { headerIp, code } = req.body;

          if (!headerIp) {
            o.code = 400;
            throw new Error("The IP of Header must be specified");
          }

          if (!code) {
            o.code = 400;
            throw new Error("Code not found");
          }

          const response = await axios.post(
            `http://${headerIp}:9000/execute-python`,
            {
              code: code,
            }
          );

          o.data = response.data;

          return o;
        }
      );
    }
  )
);

module.exports = { taskController };
