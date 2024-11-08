import sys
import json

# Import functions
from functions.create_header_node import create_header_node
from functions.create_worker_node import create_worker_node
from functions.destroy_node import destroy_node
from functions.stop_node import stop_node
from functions.describe_nodes import describe_nodes
from python.functions.restart_node import restart_node
from functions.check_nodes_state import check_nodes_state

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
      data = create_header_node()
    elif fn_name == "create_worker_node":
      data = create_worker_node()
    elif fn_name == "destroy_node":
      instance_ids = json.loads(args[2])

      if not is_array(instance_ids) or len(instance_ids) < 1:
        raise Exception("Id of Instance(s) are required to terminate")

      data = destroy_node(instance_ids)
    elif fn_name == "stop_node":
      instance_ids = json.loads(args[2])

      if not is_array(instance_ids) or len(instance_ids) < 1:
        raise Exception("Id of Instance(s) are required to stop")

      data = stop_node(instance_ids)
    elif fn_name == "describe_nodes":
      instance_ids = json.loads(args[2])

      if not is_array(instance_ids) or len(instance_ids) < 1:
        raise Exception("Id of Instance(s) are required to describe")
      
      data = describe_nodes(instance_ids)
    elif fn_name == "restart_node":
      instance_id = args[2]

      if not is_string(instance_id):
        raise Exception("Id of Instance is invalid")
      
      data = restart_node(instance_id)
    elif fn_name == "check_nodes_state":
      instance_ids = json.loads(args[2])

      if not is_array(instance_ids) or len(instance_ids) < 1:
        raise Exception("Id of Instance(s) are required to describe")
      
      data = check_nodes_state(instance_ids)
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