import sys
import json

# Import functions
from functions.create_header_node import create_header_node
from functions.create_worker_node import create_worker_node
from python.functions.destroy_nodes import destroy_nodes
from python.functions.stop_nodes import stop_nodes
from functions.describe_nodes import describe_nodes, describe_nodes_with_type
from python.functions.restart_nodes import restart_nodes
from functions.check_nodes_state import check_nodes_state
from functions.cpu_utilization import get_idle_nodes

# Import utils
from utils.response import Response
from utils.check_type import is_array, is_string

response = Response()

def main(args):
    fn_name = args[1]

    if not fn_name:
        raise Exception("Function name is required")

    result = response.getStdDict()
    data = {}

    try:
        if fn_name == "create_header_node":
            vpc_id = args[2]
            user_address = args[3]
            subnet_id = args[4]
            allowed_cidrs = json.loads(args[5])

            if not is_string(vpc_id):
                raise Exception("VPC isn't specified")

            if not is_string(subnet_id):
                raise Exception("Id of Instance is invalid")
            
            if not is_array(allowed_cidrs) or len(allowed_cidrs) < 1:
                raise Exception("Allowed CIDR Block is invalid")

            data = create_header_node(
                vpc_id=vpc_id,
                subnet_id=subnet_id,
                allowed_cidrs=allowed_cidrs
            )
        elif fn_name == "create_worker_node":
            vpc_id = args[2]
            user_address = args[3]
            subnet_id = args[4]
            allowed_cidrs = json.loads(args[5])

            if not is_string(vpc_id):
                raise Exception("VPC isn't specified")

            if not is_string(subnet_id):
                raise Exception("Id of Instance is invalid")
            
            if not is_array(allowed_cidrs) or len(allowed_cidrs) < 1:
                raise Exception("Allowed CIDR Block is invalid")

            data = create_worker_node(
                vpc_id=vpc_id,
                subnet_id=subnet_id,
                allowed_cidrs=allowed_cidrs
            )
        elif fn_name == "destroy_nodes":
            instance_ids = json.loads(args[2])

            if not is_array(instance_ids) or len(instance_ids) < 1:
                raise Exception("Id of Instance(s) are required to terminate")

            data = destroy_nodes(instance_ids)
        elif fn_name == "destroy_node":
            instance_id = args[2]

            if not is_string(instance_id):
                raise Exception("Id of Instance is invalid")

            data = destroy_nodes([instance_id])
        elif fn_name == "stop_nodes":
            instance_ids = json.loads(args[2])

            if not is_array(instance_ids) or len(instance_ids) < 1:
                raise Exception("Id of Instance(s) are required to stop")

            data = stop_nodes(instance_ids)
        elif fn_name == "stop_node":
            instance_id = args[2]

            if not is_string(instance_id):
                raise Exception("Id of Instance is invalid")

            data = stop_nodes([instance_id])
        elif fn_name == "describe_nodes":
            instance_ids = json.loads(args[2])

            if not is_array(instance_ids) or len(instance_ids) < 1:
                raise Exception("Id of Instance(s) are required to describe")
            
            data = describe_nodes(instance_ids)
        elif fn_name == "restart_nodes":
            instance_ids = json.loads(args[2])

            if not is_array(instance_ids) or len(instance_ids) < 1:
                raise Exception("Id of Instance(s) are required to stop")
            
            data = restart_nodes(instance_ids)
        elif fn_name == "restart_node":
            instance_id = args[2]

            if not is_string(instance_id):
                raise Exception("Id of Instance is invalid")
            
            data = restart_nodes([instance_id])
        elif fn_name == "describe_nodes_with_type":
            node_type = args[2]
            
            data = describe_nodes_with_type(node_type)
        elif fn_name == "check_nodes_state":
            instance_ids = json.loads(args[2])

            if not is_array(instance_ids) or len(instance_ids) < 1:
                raise Exception("Id of Instance(s) are required to describe")
            
            data = check_nodes_state(instance_ids)
        elif fn_name == 'get_idle_nodes':
            data = get_idle_nodes()
        else:
            raise Exception(f"Function {fn_name} is not valid")

        result["message"] = "Execution sucessfully"
        result["error"] = 0
        result["data"] = data

        print(json.dumps(result))
    except Exception as e:
        result["message"] = e
        result["error"] = 1
        print(json.dumps(result))
    finally:
        sys.stdout.flush()

if __name__ == "__main__":
    main(sys.argv)