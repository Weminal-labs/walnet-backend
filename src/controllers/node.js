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
const { PyProcessService } = require("../services/python");

const nodeController = new Controller("/node");
const nodesController = new Controller("/nodes");

const pyprocess = new PyProcessService();

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
      const response = await pyprocess.exec(
        "describe_nodes",
        JSON.stringify(instanceIds)
      );

      if (response.error) {
        o.code = 500;
        o.message = response.message;
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
      const response = await pyprocess.exec(
        "check_nodes_state",
        JSON.stringify(instanceIds)
      );

      if (response.error) {
        o.code = 500;
        o.message = response.message;
      }

      o.data = response.data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/register", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      const response = await pyprocess.exec("create_worker_node");

      if (response.error) {
        o.code = 500;
        o.message = response.message;
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

      const response = await pyprocess.exec(
        "stop_node",
        JSON.stringify([instanceId])
      );

      if (response.error) {
        o.code = 500;
        o.message = response.message;
      }

      o.data = response.data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/destroy", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceId: string;
       * }
       */
      const { instanceId } = req.body;

      const response = await pyprocess.exec(
        "destroy_node",
        JSON.stringify([instanceId])
      );

      if (response.error) {
        o.code = 500;
        o.message = response.message;
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

      const response = await pyprocess.exec("restart_node", instanceId);

      if (response.error) {
        o.code = 500;
        o.message = response.message;
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
      const response = await pyprocess.exec(
        "check_nodes_state",
        JSON.stringify([instanceId])
      );

      if (response.error) {
        o.code = 500;
        o.message = response.message;
      }

      console.log(response);

      o.data = response.data[0];

      return o;
    });
  })
);

module.exports = { nodeController, nodesController };
