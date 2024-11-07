from flask import Flask, request
from pysui import SuiTransaction

# Import utils
from utils.generate_token import generate_token
from utils.generate_keyname import generate_keypair_name, generate_security_group_name
from utils.sui_client import verify_sui_address, get_sui_client, get_txn, get_movecall_target
from utils.regions import core_region

# Import functions
from functions.aws.create_header_node import create_header_node
from functions.aws.create_worker_node import create_worker_node
from functions.aws.create_key_pair import create_key_pair
from functions.aws.create_security_group import create_security_group

# Import smart contract
from smart_contracts.walnet import smc as walnet_smc

app = Flask(__name__)

def get_user_address(req):
   return req.headers.get('userAddress')

# Work as Health check
@app.route("/")
def hello():
  return "Hello World!"

# Consumer will call this API and flask will handle his/her request an create a cluster
# with a head node
# After the head node is created, this method will call Register Node and Deploy Cluster
# contracts to assign 2 new transactions.
@app.route('/deploy_cluster', methods=['POST'])
def deploy_cluster():
    # Get userId from headers
    user_address = get_user_address(request)

    # Verify user
    if not verify_sui_address(user_address):
        return {
            "message": "The address isn't valid"
        }, 400

    # Create header node
    header_node_ip, header_metadata = create_header_node()

    # Call Create Cluster contract
    # We need
    cluster_metadata = {
       "cluster_type": 0,
       "cluster_processor": "Intel",
       "location": core_region
    }

    # Call Register Node contract
    node_metadata = {
       "node_type": 0
    }

    # Construct transaction to create cluster on Sui chain
    txn = get_txn()
    txn.move_call(
        target=get_movecall_target(
            walnet_smc["address"],
            walnet_smc["module"],
            walnet_smc["functions"]["register_cluster"]
        ),
        arguments=[
            cluster_metadata["cluster_type"],
            cluster_metadata["cluster_processor"].encode(),
            cluster_metadata["location"].encode()
        ]
    )
    
    # Construct transaction to register node on Sui chain
    txn = get_txn()
    txn.move_call(
        target=get_movecall_target(
            walnet_smc["address"],
            walnet_smc["module"],
            walnet_smc["functions"]["register_cluster"]
        ),
        arguments=[
            node_metadata["node_type"],
            node_metadata["header_node_ip"].encode()
        ]
    )
    
    # Execute transactions
    cluster_tx_result = get_sui_client().execute_transaction(cluster_tx, sender_address=user_address)
    node_tx_result = get_sui_client().execute_transaction(node_tx, sender_address=user_address)

    return {
       "message": "Cluster is created successfully"
    }, 201

@app.route('/register_node', methods=['POST'])
def register_node():
    # Get userId from headers
    user_address = get_user_address(request)

    # Verify user
    if not verify_sui_address(user_address):
        return {
            "message": "The address isn't valid"
        }, 400

    # worker_node_ips = create_worker_node(token, key_name, [security_group_id], header_node_ip)
    worker_node_ips = create_worker_node()

    node_metadata = {
       "node_type": 1
    }
   
    return {
       "message": "Node is registered successfully"
    }, 201

if __name__ == "__main__":
    app.run()
