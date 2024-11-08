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
      const data = await pyprocess.exec("describe_nodes", instanceIds);

      o.data = data;

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
      const data = await pyprocess.exec("check_nodes_state", instanceIds);

      o.data = data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/register", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      const data = await pyprocess.exec("create_worker_node");

      o.data = data;

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

      const data = await pyprocess.exec("stop_node", [instanceId]);

      o.data = data;

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

      const data = await pyprocess.exec("destroy_node", [instanceId]);

      o.data = data;

      return o;
    });
  })
);

nodeController.appendHandler(
  new Handler("/reboot", "post", [verifyAddress], function (req, res) {
    return this.utils.Error.handleResponseError(this, res, async function (o) {
      /**
       * The structure of body
       * {
       *   instanceId: string;
       * }
       */
      const { instanceId } = req.body;

      const data = await pyprocess.exec("destroy_node", [instanceId]);

      o.data = data;

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
      const data = await pyprocess.exec("check_nodes_state", [instanceId]);

      o.data = data[0];

      return o;
    });
  })
);

module.exports = { nodeController, nodesController };
