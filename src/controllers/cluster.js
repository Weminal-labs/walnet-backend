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
      const vpc_id = process.env.VPC_ID;
      const userAddress = req.headers["user-address"];
      const subnetId = process.env.PRIVATE_SUBNET_1;
      const allowedCidrs = [
        process.env.PUBLIC_SUBNET_1_CIDR,
        process.env.PUBLIC_SUBNET_2_CIDR,
        process.env.PRIVATE_SUBNET_1_CIDR,
        process.env.PRIVATE_SUBNET_2_CIDR,
      ];

      if (!subnetId) {
        o.code = 500;
        console.error("Subnet Id not found");
        throw new Error("There is some errors in server.");
      }

      const data = await pyprocess.exec(
        "create_header_node",
        vpc_id,
        userAddress,
        subnetId,
        JSON.stringify(allowedCidrs)
      );

      o.data = data;

      return o;
    });
  })
);

module.exports = { clusterController };
