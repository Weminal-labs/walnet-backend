const { Sui_NetworkModule } = require("../../abis/network");
const { sign, call, functions } = require("../../sui");

async function executeFullCompleteTaskTransaction(data) {
  const { address, taskId, processingTime } = data;

  // Query
  const response = await call(address, functions.getOwnedObjects, {
    MatchAll: [
      {
        StructType: Sui_NetworkModule.structs.clusterCapability,
      },
    ],
  });

  if (!response.code) throw new Error(response.message);

  const clusterCapabilityId = response.data[0].data.content.fields.id.id;

  // Sign a transaction
  await sign(address, Sui_NetworkModule.functions.completeTask, function (txn) {
    return [
      txn.object(Sui_NetworkModule.networkId),
      txn.object(clusterCapabilityId),
      txn.pure.u64(taskId),
      txn.pure.u64(processingTime),
    ];
  });
}

async function confirmTaskIsCompleted(data) {
  await executeFullCompleteTaskTransaction({
    address: data.address,
    taskId: data.taskId,
    processingTime: data.processingTime,
  });
}

module.exports = { confirmTaskIsCompleted };
