const CronJob = require("../../classes/cronjob");
const { describeNodeswithType, queryNodeMetadata } = require("../node");

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
const checkCPUUtilizationJob = new CronJob(
  "* 15 * * * *",
  async function () {}
);

module.exports = {
  nodesConsiderationJob,
  checkCPUUtilizationJob,
};
