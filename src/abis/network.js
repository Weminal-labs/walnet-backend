const packageId = process.env.NETWORK_PACKAGE_ID;
const networkId = process.env.NETWORK_ID;
const nodeRegistryId = process.env.NODE_REGISTRY_ID;

const modules = {
  network: process.env.NETWORK_PACKAGE_NAME,
};

const Sui_NetworkModule = {
  id: packageId,
  name: modules.network,
  networkId,
  nodeRegistryId,
  structs: {
    node: `${packageId}::${modules.network}::Node`,
    cluster: `${packageId}::${modules.network}::Cluster`,
    task: `${packageId}::${modules.network}::Task`,
    nodeCapability: `${packageId}::${modules.network}::NodeCapability`,
    clusterCapability: `${packageId}::${modules.network}::ClusterCapability`,
  },
  functions: {
    // Arguments
    // arg0: ref Network (pass Network Id)
    // arg1: ref NodeCapability (pass NodeCapability Id)
    // arg2: task Id
    // arg3: compute time
    completeTask: `${packageId}::${modules.network}::complete_task`,
    // Arguments
    // arg0: ref Network (pass Network Id)
    // arg1: Node Id
    queryNodeInfo: `${packageId}::${modules.network}::query_node_info`,
    // Arguments
    // arg0: ref Network (pass Network Id)
    // arg1: Cluster Id
    queryClusterInfo: `${packageId}::${modules.network}::query_cluster_info`,
    // Arguments
    // arg0: ref Network (pass Network Id)
    // arg1: Cluster Id
    // arg2: ref NodeCapability (pass NodeCapability Id)
    joinCluster: `${packageId}::${modules.network}::join_cluster`,
    // Arguments
    // arg0: ref NodeRegistry (pass Node Registry Id)
    // arg1: ref Network (pass Network Id)
    // arg2: ref NodeCapability (pass NodeCapability Id)
    deregisterNode: `${packageId}::${modules.network}::deregister_node`,
  },
};

module.exports = { Sui_NetworkModule };
