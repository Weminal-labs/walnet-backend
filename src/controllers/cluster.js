// When create a node, you will receive an array of object like
// {
//   "id": string,
//   "ip": string,
//   "architecture": string,
//   "state": {
//     "code": string,
//     "name": string
//   },
//   "cpu": {
//       "core": string,
//       "threadPerCore": string
//   }
// }

const { Handler, Controller } = require("../classes/controller");

// Import middlewares
const verifyAddress = require("../middlewares/verifyAddress");

// Import services
const { PyProcessService } = require("../services/python");

const clusterController = new Controller("/cluster");
const clustersController = new Controller("/clusters");

const pyprocess = new PyProcessService();

clusterController.appendHandler(
  new Handler("/deploy", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      const { subnetId = "" } = req.body;

      const data = await pyprocess.exec("create_header_node", subnetId);

      o.data = data;

      return o;
    });
  })
);

module.exports = { clusterController };
