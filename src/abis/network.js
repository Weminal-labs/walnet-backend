const packageId =
  "0xa99f7ef963817b3a72dd02c1f76350223ac00dba1c00aa56471a8a8d1284c56a";

const modules = {
  network: "network",
};

const Sui_NetworkModule = {
  structs: {
    node: `${packageId}::${modules}::Node`,
    cluster: `${packageId}::${modules}::Cluster`,
    task: `${packageId}::${modules}::Task`,
  },
  functions: {},
};

module.exports = { Sui_NetworkModule };
