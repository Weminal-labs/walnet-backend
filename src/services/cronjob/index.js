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
  const responses = await Promise.all([describeNodeswithType()]);
  console.log(responses);
  for (const response of responses) console.log(response.data);

  // Get Nodes' metadata on chain

  // Consider

  // Call join cluster transaction
});

// Currently, our infrastructure base on cloud, so we
// need to check the usage of cpu in each node that is created
// to decide something to do like stop, destroy instance.
const checkIdleNodeJob = new CronJob(
  // "* 15 * * * *",
  "* 15 * * * *",
  async function () {
    console.log("Check idle nodes");
    const response = await getIdleNodes();
    const idleNodes = response.data;
    if (!idleNodes || idleNodes.length === 0) return;
    await stopNodes(idleNodes);
    console.log("All idle nodes are destroyed");
  }
);

module.exports = {
  nodesConsiderationJob,
  checkIdleNodeJob,
};
