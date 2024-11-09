const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Import utils
const Utils = require("./utils");

// Import controllers
const { clusterController } = require("../src/controllers/cluster");
const { nodeController, nodesController } = require("../src/controllers/node");
const { taskController } = require("../src/controllers/task");

// Import middlewares
const verifyAddress = require("./middlewares/verifyAddress");

const app = express();
const server = http.createServer(app);

// Add global middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create router
const router = express.Router();

// Create some APIs
app.get("/", (req, res) => {
  return Utils.Error.handleResponseError(app, res, function (o) {
    o.data = "Welcome to my app";
    return o;
  });
});

app.get("/verify-address", verifyAddress);

app.get("/check-health", (req, res) => {
  return Utils.Error.handleResponseError(app, res, async function (o) {
    o.data = {
      message: "Health Ok",
    };

    return o;
  });
});

// Apply router
app.use(router);
nodeController.setRouter(router);
clusterController.setRouter(router);
nodesController.setRouter(router);
taskController.setRouter(router);

// Build handler
nodeController.build();
nodesController.build();
clusterController.build();
taskController.build();

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, function () {
  console.log(`Your server is listening on http://localhost:${PORT}`);
});
