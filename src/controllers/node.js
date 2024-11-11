// When describe nodes or create a node, you will receive an array of object like
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

// When destroy or stop a Node, you will receive an object like
// {
//   "id": string,
//   "currentState": {
//     "code": string,
//     "name": string
//   },
//   "previousState": {
//     "code": string,
//     "name": string
//   }
// }
const { Handler, Controller } = require("../classes/controller");

// Import middlewares
const verifyAddress = require("../middlewares/verifyAddress");

// Import services
const {
  queryNodeMetadata,
  registerWorkerNode,
  stopNode,
  restartNode,
  checkNodesState,
  checkNodeState,
  destroyNode,
  describeNodes,
  isApplicationReady,
} = require("../services/node");

const nodeController = new Controller("/node");
const nodesController = new Controller("/nodes");

nodesController.appendHandler(
  new Handler("/", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceIds: Array<string>;
       * }
       */
      const { instanceIds } = req.body;
      const response = await describeNodes(instanceIds);

      if (response.error) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response.data;

      return o;
    });
  })
);

nodesController.appendHandler(
  new Handler("/check-state", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceIds: Array<string>;
       * }
       */
      const { instanceIds } = req.body;
      const response = await checkNodesState(instanceIds);

      if (response.error) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response.data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/register", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      const vpcId = process.env.VPC_ID;
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
        throw new Error("There is some errors in server.");
      }

      const response = await registerWorkerNode(
        vpcId,
        userAddress,
        subnetId,
        allowedCidrs
      );

      if (response.error) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response.data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/stop", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceId: string;
       * }
       */
      const { instanceId } = req.body;

      const response = await stopNode(instanceId);

      if (response.error) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response.data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/destroy", "delete", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceId: string;
       * }
       */
      const { instanceId } = req.body;

      const response = await destroyNode(instanceId);

      if (response.error) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response.data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/restart", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceId: string;
       * }
       */
      const { instanceId } = req.body;

      const response = await restartNode(instanceId);

      if (response.error) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response.data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/check-state", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceId: string;
       * }
       */
      const { instanceId } = req.body;
      const response = await checkNodeState(instanceId);

      if (response.error) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response.data[0];

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/query", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceIds: Array<string>;
       * }
       */
      const { address } = req.body;
      const response = await queryNodeMetadata({ address });

      if (!response.code) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/check-application", "post", [verifyAddress], function (
    req,
    res
  ) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   ip: string;
       *   nodeType: "header" | "worker"
       * }
       */
      const { ip, nodeType } = req.body;

      const response = await isApplicationReady(ip, nodeType);

      if (response.status !== 200) {
        o.code = 500;
        throw new Error(response.message);
      }

      o.data = response.data;

      return o;
    });
  })
);

module.exports = { nodeController, nodesController };
