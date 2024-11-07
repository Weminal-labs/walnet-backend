import sys
import json

# Import functions
from functions.create_header_node import create_header_node
from functions.create_worker_node import create_worker_node

# Import utils
from utils.response import Response

response = Response()

def main(args):
  fn_name = args[1]

  if not fn_name:
    raise Exception("Function name is required")

  result = response.getStdDict()
  data = {
    "ipAddress": "",
    "info": {}
  }

  try:
    if fn_name == "create_header_node":
      ipv4, info = create_header_node()
      data["ipAddress"] = ipv4
      data["info"] = info
    
    if fn_name == "create_worker_node":
      ipv4, info = create_worker_node()
      data["ipAddress"] = ipv4
      data["info"] = info

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