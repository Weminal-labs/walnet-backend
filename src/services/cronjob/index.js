const CronJob = require("../../classes/cronjob");
const {
  describeNodeswithType,
  queryNodeMetadata,
  getIdleNodes,
  stopNodes,
} = require("../node");

// Every 30 seconds, backend will
// - Get Node state in AWS
// - Get Node Metadata in Sui
// To verify and consider which worker nodes can join to header nodes.
const nodesConsiderationJob = new CronJob("*/30 * * * * *", async function () {
  // Get Nodes' state on AWS
  const promises = Promise.all([describeNodeswithType(), queryNodeMetadata()]);

  // Get Nodes' metadata on chain
  // Consider
});

// Currently, our infrastructure base on cloud, so we
// need to check the usage of cpu in each node that is created
// to decide something to do like stop, destroy instance.
const checkIdleNodeJob = new CronJob(
  // "* 15 * * * *",
  "*/10 * * * * *",
  async function () {
    console.log("Check idle nodes");
    const idleNodes = await getIdleNodes();
    const response = await stopNodes(idleNodes);
    console.log("All idle nodes are destroyed");
  }
);

module.exports = {
  nodesConsiderationJob,
  checkIdleNodeJob,
};
